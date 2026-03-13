import random
import string
import math
from datetime import datetime

from app.core.database import get_database
from app.services.supervisor_service import SupervisorService
from app.services.insurance_service import InsuranceService
from app.repositories.incident_repository import IncidentRepository
from app.services.orchestrator_service import OrchestratorService
from app.services.observability_service import ObservabilityService
from app.services.azure_maps_service import AzureMapsService
from app.services.ambulance_service import AmbulanceService
from app.services.decision_trace_service import DecisionTraceService
from app.agents.emergency_triage_agent import TriageAgent
from app.ai.rag_service import RAGService
from app.services.triage_service import TriageService



class IncidentService:

    def __init__(self):
        self.rag_service = RAGService()
        self.triage_agent = TriageAgent(self.rag_service)
        self.triage_service = TriageService()
        self.supervisor_service = SupervisorService()
        self.insurance_service = InsuranceService()
        self.incident_repository = IncidentRepository()
        self.observability_service = ObservabilityService()
        self.azure_maps_service = AzureMapsService()
        self.ambulance_service = AmbulanceService()
        self.decision_trace_service = DecisionTraceService()

    # Serializer to avoid errors with ObjectId
    def serialize_incident(self, incident: dict):
        if not incident:
            return None

        if "_id" in incident:
            incident["_id"] = str(incident["_id"])

        if "assigned_supervisor_id" in incident and incident["assigned_supervisor_id"]:
            incident["assigned_supervisor_id"] = str(incident["assigned_supervisor_id"])

        return incident

    # Create incident code
    def generate_incident_code(self):
        now = datetime.utcnow().strftime("%y%m%d%H%M")

        rand = ''.join(
            random.choices(string.ascii_uppercase + string.digits, k=2)
        )

        return f"INC-{now}-{rand}"

    # ===============================
    # SELECT BEST AMBULANCE
    # ===============================
    async def select_best_ambulance(self, incident_location):

        ambulances = await self.ambulance_service.get_ambulances(
            status="available",
            page_size=50
        )

        if not ambulances:
            return None

        incident_lat = incident_location["coordinates"][1]
        incident_lng = incident_location["coordinates"][0]

        candidates = []

        for amb in ambulances["data"]:

            coords = amb.get("location", {}).get("coordinates")

            if not coords:
                continue

            amb_lat = coords[1]
            amb_lng = coords[0]

            distance = math.sqrt(
                (incident_lat - amb_lat) ** 2 +
                (incident_lng - amb_lng) ** 2
            )

            candidates.append({
                "ambulance": amb,
                "distance": distance
            })

        candidates.sort(key=lambda x: x["distance"])

        top_candidates = candidates[:3]

        best_option = None
        best_eta = 9999

        for candidate in top_candidates:

            amb = candidate["ambulance"]

            coords = amb["location"]["coordinates"]

            route = await self.azure_maps_service.get_route(
                origin_lat=coords[1],
                origin_lng=coords[0],
                dest_lat=incident_lat,
                dest_lng=incident_lng
            )

            eta = route.get("eta_minutes", 999)

            if eta < best_eta:
                best_eta = eta
                best_option = {
                    "ambulance_id": amb["id"],
                    "route": route,
                    "eta": eta
                }

        return best_option

    # create incident
    async def create_incident(self, payload):

        db = get_database()

        zone = await db["zones"].find_one({"_id": payload.zone_id})
        if not zone:
            raise Exception("Zone not found")

        supervisor = await self.supervisor_service.assign_supervisor(zone)

        code = self.generate_incident_code()

        incident_data = {
            "code": code,
            "zone_id": payload.zone_id,
            "severity": payload.severity,
            "patient": payload.patient.dict(),
            "symptoms_summary": payload.symptoms_summary,
            "location": payload.location.dict(),
            "risk_score": None,
            "confidence": None,
            "assigned_supervisor_id": supervisor["_id"],
            "status": "pending",
            "assigned_ambulance_id": None,
            "assigned_clinic_id": None,
            "estimated_distance": None,
            "agent_decisions": [],
            "governance": None,
            "reliability": None,
            "created_at": datetime.utcnow()
        }

        incident = await self.incident_repository.create_incident(incident_data)

        # ===============================
        # TRIAGE AGENT (AI CLASSIFICATION)
        # ===============================

        triage_result = None

        try:
            triage_result = await self.triage_agent.analyze(payload.symptoms_summary)

            risk_score = self.triage_service.calculate_risk_score(triage_result)
            triage_result["risk_score"] = risk_score

            print("\n===== TRIAGE AGENT RESULT =====")
            print(triage_result)
            print("================================\n")

        except Exception as e:
            # No romper el flujo si el agente falla
            triage_result = None


        await db["zones"].update_one(
            {"_id": payload.zone_id},
            {"$inc": {"active_incidents": 1}}
        )

        # ===============================
        # ORCHESTRATOR PROCESS
        # ===============================
        orchestrator = OrchestratorService()

        incident_for_orchestrator = {
            **incident,
            "id": str(incident["_id"]),
            "triage": triage_result
        }

        decision = await orchestrator.process_incident(incident_for_orchestrator)

        # ===============================
        # ROUTE INTELLIGENCE
        # ===============================

        distance_meters = max(decision.get("distance_meters", 1), 1)
        travel_time_seconds = max(decision.get("travel_time_seconds", 1), 1)
        traffic_delay_seconds = max(decision.get("traffic_delay_seconds", 0), 0)

        route_intelligence = await self.azure_maps_service.get_route_intelligence(
            distance_meters=distance_meters,
            travel_time_seconds=travel_time_seconds,
            traffic_delay_seconds=traffic_delay_seconds
        )

        traffic = route_intelligence.get("external_impact", {}).get("traffic_severity_percent", 0)
        weather = route_intelligence.get("external_impact", {}).get("weather_impact_percent", 0)

        eta = max(
            route_intelligence.get("eta_intelligence", {}).get("ai_adjusted_eta_minutes", 1),
            1
        )

        reliability_score = max(
            decision.get("reliability", {}).get("decision_reliability_score", 0.8),
            0.01
        )

        transport_risk_score = int(
            (traffic * 0.4) +
            (weather * 0.3) +
            (eta * 2) +
            ((1 - reliability_score) * 20)
        )

        if transport_risk_score < 35:
            transport_risk_level = "LOW"
        elif transport_risk_score < 65:
            transport_risk_level = "MEDIUM"
        else:
            transport_risk_level = "HIGH"

        # ===============================
        # GET OPTIMIZED ROUTES
        # ===============================

        optimized_routes = decision.get("optimized_routes", [])

        best_route = None

        for r in optimized_routes:
            if r.get("best") is True:
                best_route = r
                break

        assigned_ambulance_id = None
        assigned_clinic_id = None
        route = None

        if best_route:
            assigned_ambulance_id = best_route.get("ambulance_id")
            assigned_clinic_id = best_route.get("clinic_id")
            route = best_route.get("route")

        # ===============================
        # UPDATE INCIDENT
        # ===============================

        updated_incident = await self.incident_repository.update_incident(
            str(incident["_id"]),
            {
                "risk_score": decision["risk_score"],
                "confidence": decision["confidence"],
                "assigned_ambulance_id": assigned_ambulance_id,
                "assigned_clinic_id": assigned_clinic_id,
                "estimated_distance": distance_meters,
                "status": "routed",
                "route": route,
                "transport_risk_level": transport_risk_level,
                "agent_decisions": decision.get("agent_decisions", []),
                "governance": decision.get("governance"),
                "reliability": decision.get("reliability"),
                "eta_intelligence": route_intelligence.get("eta_intelligence"),
                "external_impact": route_intelligence.get("external_impact"),
                "transport_projection": route_intelligence.get("transport_projection")
            }
        )

        updated_incident = self.serialize_incident(updated_incident)

        return {
            "id": updated_incident["_id"],
            "code": updated_incident["code"],
            "zone_id": updated_incident["zone_id"],
            "severity": updated_incident["severity"],
            "risk_score": updated_incident.get("risk_score"),
            "confidence": updated_incident.get("confidence"),
            "assigned_supervisor_id": updated_incident["assigned_supervisor_id"],
            "assigned_ambulance_id": updated_incident.get("assigned_ambulance_id"),
            "patient": updated_incident["patient"],
            "symptoms_summary": updated_incident["symptoms_summary"],
            "location": updated_incident["location"],
            "status": updated_incident["status"],
            "assigned_clinic_id": updated_incident.get("assigned_clinic_id"),
            "estimated_distance": updated_incident.get("estimated_distance"),
            "eta_intelligence": updated_incident.get("eta_intelligence"),
            "external_impact": updated_incident.get("external_impact"),
            "transport_projection": updated_incident.get("transport_projection"),
            "agent_decisions": updated_incident.get("agent_decisions", []),
            "governance": updated_incident.get("governance"),
            "reliability": updated_incident.get("reliability"),
            "created_at": updated_incident["created_at"]
        }

    async def get_incidents(
        self,
        status: str = None,
        severity: str = None,
        zone_id: str = None,
        insurance_id: str = None,
        page: int = 1,
        page_size: int = 20,
        sort_by: str = "created_at",
        sort_order: str = "desc",
    ):
        return await self.incident_repository.search_incidents(
            status=status,
            severity=severity,
            zone_id=zone_id,
            insurance_id=insurance_id,
            page=page,
            page_size=page_size,
            sort_by=sort_by,
            sort_order=sort_order,
        )  

    async def get_decision_trace(self, incident_id: str):

        incident = await self.incident_repository.get_by_id(incident_id)

        if not incident:
            raise Exception("Incident not found")

        incident = self.serialize_incident(incident)

        observability_logs = await self.observability_service.get_ai_observability_logs(
            incident_id
        )

        trace = await self.decision_trace_service.get_decision_trace_by_incident(incident_id)

        return {
            "incident_id": incident["_id"],
            "code": incident.get("code"),
            "risk_score": incident.get("risk_score"),
            "confidence": incident.get("confidence"),
            "governance": incident.get("governance"),
            "reliability": incident.get("reliability"),
            "route":incident.get("route"),
            "agent_decisions": incident.get("agent_decisions", []),
            "observability_logs": observability_logs,
            "optimized_routes" : trace.get("optimized_routes", []),
            "created_at": incident.get("created_at"),
        }
    
    async def get_agent_trace(self, incident_id: str):

        incident = await self.incident_repository.get_by_id(incident_id)

        if not incident:
            raise Exception("Incident not found")

        decisions = incident.get("agent_decisions", [])

        # table
        decision_steps = decisions

        # Average confidence
        evaluation_score = (
            sum(d.get("confidence", 0) for d in decisions) / len(decisions)
            if decisions else 0
        )

        # Stability chart
        decision_stability_trend = [
            {
                "time": d.get("timestamp"),
                "confidence": d.get("confidence", 0) * 100
            }
            for d in decisions
        ]

        return {
            "model_version": "v1.0",
            "inference_mode": "sequential",
            "decision_stability_trend": decision_stability_trend,
            "decision_steps": decision_steps,
            "evaluation_score": evaluation_score
        }
    
    async def get_incident_analytics(self, incident_id: str):

        incident = await self.incident_repository.get_by_id(incident_id)

        trace = await self.decision_trace_service.get_decision_trace_by_incident(
            incident_id
        )

        optimized_routes = trace.get("optimized_routes", [])

        if not incident:
            raise Exception("Incident not found")

        # -------------------------------------------------
        # Get the best route
        # -------------------------------------------------

        best_route = next((r for r in optimized_routes if r.get("best")), None)

        if not best_route:
            raise Exception("Best route not found")

        distance_meters = best_route["route"]["distance_meters"]
        travel_time_seconds = best_route["route"]["travel_time_seconds"]

        eta_to_patient = best_route["eta_to_patient"]
        eta_to_clinic = best_route["eta_to_clinic"]

        distance_km = distance_meters / 1000
        time_minutes = travel_time_seconds / 60

        # -------------------------------------------------
        # Derive real risk metrics
        # -------------------------------------------------

        # velocidad estimada
        avg_speed = distance_km / (time_minutes / 60)

        # Estimated traffic
        traffic = max(5, min(40, int(30 - avg_speed)))

        # Distance risk
        distance_risk = min(30, int(distance_km * 2))

        # Approximate urban density
        urban_density = min(25, int(best_route["score"] / 150))

        # Weather still simulated
        weather = random.randint(5, 15)

        risk_breakdown = {
            "traffic": traffic,
            "weather": weather,
            "distance": distance_risk,
            "urban_density": urban_density,
        }

        # -------------------------------------------------
        # Risk score global
        # -------------------------------------------------

        risk_score = int(
            traffic * 0.4
            + weather * 0.2
            + distance_risk * 0.2
            + urban_density * 0.2
        )

        # -------------------------------------------------
        # Risk projection based on route progress
        # -------------------------------------------------

        segments = ["Start", "Segment 1", "Segment 2", "Segment 3", "Arrival"]

        risk_projection = []

        for i, segment in enumerate(segments):

            progress_factor = i / (len(segments) - 1)

            risk = int(risk_score * (0.6 + progress_factor * 0.4))

            predicted_risk = min(
                100,
                int(risk + traffic * 0.3)
            )

            risk_projection.append(
                {
                    "segment": segment,
                    "risk": risk,
                    "predictedRisk": predicted_risk,
                }
            )

        # -------------------------------------------------
        # Predictive signals
        # -------------------------------------------------

        delay_risk = min(25, int(eta_to_patient / 60))

        predictive_signals = {
            "delay_risk": delay_risk,
            "weather_delay_risk": weather,
            "incident_probability": (
                "Low" if risk_score < 40 else
                "Medium" if risk_score < 70 else
                "High"
            ),
            "traffic": (
                "Low" if traffic < 10 else
                "Moderate" if traffic < 20 else
                "High"
            ),
            "idle_over_45s": eta_to_patient > 2700,
        }


        routes_response = []

        for route in optimized_routes:

            routes_response.append(
                {
                    "route_name": f"Route {route['ambulance_id'][:4]}",
                    "eta_minutes": int(route["eta_to_patient"] / 60),
                    "traffic_level": (
                        "Low" if traffic < 10 else
                        "Moderate" if traffic < 20 else
                        "High"
                    ),
                    "score": int(100 - (route["score"] / best_route["score"] * 40)),
                }
            )

        # -------------------------------------------------

        return {
            "optimized_routes": routes_response,
            "predictive_signals": predictive_signals,
            "risk_score": risk_score,
            "risk_projection": risk_projection,
            "risk_breakdown": risk_breakdown,
        }

   
    async def close_incident(self, incident_id: str):
        db = get_database()

        incident = await self.incident_repository.get_by_id(incident_id)

        if not incident:
            raise Exception("Incident not found")

        if incident["status"] != "routed":
            raise Exception("Only routed incidents can be closed")

        if not incident.get("assigned_clinic_id"):
            raise Exception("Incident has no assigned clinic")

        updated_incident = await self.incident_repository.update_incident(
            incident_id,
            {
                "status": "closed",
                "closed_at": datetime.utcnow(),
            },
        )

        await db["zones"].update_one(
            {"_id": incident["zone_id"]},
            {"$inc": {"active_incidents": -1}},
        )

        updated_incident = self.serialize_incident(updated_incident)

        return {
            "id": updated_incident["_id"],
            "status": updated_incident["status"],
            "closed_at": updated_incident["closed_at"],
        }