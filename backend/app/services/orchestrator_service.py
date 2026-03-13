import random
from datetime import datetime
import time

from app.ai.rag_service import RAGService
from app.services.agents.risk_agent import RiskAgent
from app.agents.emergency_triage_agent import TriageAgent
from app.services.agents.routing_agent import RoutingAgent

from app.services.decision_trace_service import DecisionTraceService
from app.services.assessment_service import AIAssessmentService

from app.services.dispatch.dispatch_engine import dispatch

from app.repositories.ambulance_repository import AmbulanceRepository
from app.repositories.clinic_repository import ClinicRepository
from app.services.triage_service import TriageService
from app.services.observability_service import ObservabilityService
from app.services.ambulance_service import AmbulanceService
from app.services.azure_maps_service import AzureMapsService


class OrchestratorService:

    def __init__(self):
        self.rag_service = RAGService()
        self.risk_agent = RiskAgent()
        self.routing_agent = RoutingAgent()
        self.decision_trace_service = DecisionTraceService()
        self.ai_assessment_service = AIAssessmentService()
        self.triage_agent = TriageAgent(self.rag_service)
        self.triage_service = TriageService()
        self.observability_service = ObservabilityService()
        self.ambulance_service = AmbulanceService()
        self.azure_maps_service = AzureMapsService()
        self.ambulance_repository = AmbulanceRepository()
        self.clinic_repository = ClinicRepository()

    async def generate_optimized_routes(self, incident: dict):

        patient_location = incident.get("location")

        if not patient_location:
            return []

        ambulance_result = await self.ambulance_repository.search_ambulances(
            status="available",
            page=1,
            page_size=10
        )

        ambulances = ambulance_result["data"]
        ambulances = ambulances[:3]

        print("TYPE AMBULANCES:", type(ambulances))
        print("AMBULANCES:", ambulances)

        formatted_ambulances = []

        for amb in ambulances:
            location = amb.get("location")

            if location and "coordinates" in location:

                lon = location["coordinates"][0]
                lat = location["coordinates"][1]

                formatted_ambulances.append({
                    "id": amb["id"],
                    "status": amb.get("status"),
                    "location": {
                        "lat": lat,
                        "lon": lon
                    }
                })

        clinics = await self.clinic_repository.get_all_clinics()
        clinics = [c for c in clinics if c.get("active")][:3]

        dispatch_result = await dispatch(
            patient_location,
            ambulances=formatted_ambulances,
            clinics=clinics
        )

        routes = dispatch_result["options"]


        for route in routes:

            route["patient_location"] = patient_location

            amb = next(
                (a for a in formatted_ambulances if a["id"] == route["ambulance_id"]),
                None
            )

            if amb:
                route["ambulance_location"] = amb["location"]

            clinic = next(
                (c for c in clinics if c["id"] == route["clinic_id"]),
                None
            )

            if clinic:
                route["clinic_location"] = clinic["location"]

        return routes

    async def process_incident(self, incident: dict):

        agent_logs = []

        start_total = time.time()

        triage_data = incident.get("triage")

        if triage_data and triage_data.get("critical_metrics"):
            triage_result = triage_data
        else:
            triage_result = await self.triage_agent.analyze(
                incident.get("description", "")
            )

        start_risk = time.time()

        risk_score = self.triage_service.calculate_risk_score(triage_result)

        risk_latency = round((time.time() - start_risk) * 1000, 2)

        urgency_map = {
            1: "CRITICAL",
            2: "HIGH",
            3: "MEDIUM",
            4: "LOW"
        }

        criticality = triage_result.get("criticality_level", 3)

        triage_result["risk_score"] = risk_score
        triage_result["urgency_level"] = urgency_map.get(criticality, "MEDIUM")
        triage_result["model_version"] = "v1.0"
        triage_result["risk_latency_ms"] = risk_latency

        projection = self.triage_service.generate_risk_projection(triage_result)
        triage_result["factor_escalation_projection"] = projection

        risk_confidence = triage_result.get("confidence", 0)
        urgency_level = triage_result["urgency_level"]

        await self.observability_service.log_agent_decision(
            agent_logs=agent_logs,
            agent_name="EmergencyTriageAgent",
            stage="triage",
            decision=f"{triage_result.get('incident_type')} detected",
            confidence=risk_confidence,
            latency_ms=risk_latency,
            critical_metrics=triage_result.get("critical_metrics", [])
        )

        await self.ai_assessment_service.save_assessment(
            incident["id"],
            triage_result
        )


        start_routing = time.time()

        selected_hospital = "central-hospital"

        optimized_routes = await self.generate_optimized_routes(incident)

        print("OPTIMIZED ROUTES DEBUG:")
        for r in optimized_routes:
            print(r.get("best"), type(r.get("best")))


        best_route = next(
            (r for r in optimized_routes if r.get("best")),
            None
        )

        print("===== FACTOR ==========")
        print("BEST ROUTE:", best_route)
        print("OPTIMIZED ROUTES:", optimized_routes)
        print("=======================")

        if best_route:

            print("BEST ROUTE:", best_route)

            eta_minutes = int(best_route["eta_to_patient"] / 60)
            ambulance_id = best_route.get("ambulance_id", "unknown")

            traffic = best_route.get("traffic_level", "MEDIUM")

            traffic_penalty = {
                "LOW": 0,
                "MEDIUM": 0.05,
                "HIGH": 0.1
            }

            base_confidence = 0.85

            if eta_minutes > 10:
                base_confidence -= 0.1

            confidence = round(
                base_confidence - traffic_penalty.get(traffic, 0.05),
                2
            )

            confidence = max(0.6, min(confidence, 0.95))

        else:

            eta_minutes = 0
            ambulance_id = "unknown"
            confidence = 0.6

        routing_latency = round((time.time() - start_routing) * 1000, 2)

        ambulance_plate = "unknown"
        if ambulance_id:
            ambulance = await self.ambulance_service.get_by_id(ambulance_id)

            if ambulance:
                ambulance_plate = ambulance.get("plate", "unknown")

        decision_text = f"Best route assigned using ambulance {ambulance_plate} (ETA {eta_minutes} min)"

        # LOG ROUTING AGENT
        await self.observability_service.log_agent_decision(
            agent_logs=agent_logs,
            agent_name="RoutingAgent",
            stage="routing",
            decision=decision_text,
            confidence=confidence,
            latency_ms=routing_latency
        )

        # ----------------------------
        # ENVIRONMENT INTELLIGENCE
        # ----------------------------

        weather_risk = 0
        traffic_risk = 0
        distance_risk = 0

        try:

            if best_route:

                ambulance_location = best_route.get("ambulance_location")
                patient_location = best_route.get("patient_location")

                if ambulance_location:

                    traffic_data = await self.azure_maps_service.get_traffic(
                        ambulance_location["lat"],
                        ambulance_location["lon"]
                    )

                    current_speed = traffic_data.get("current_speed", 0)
                    free_flow_speed = traffic_data.get("free_flow_speed", 1)

                    if free_flow_speed > 0:
                        traffic_severity = 1 - (current_speed / free_flow_speed)
                        traffic_risk = max(0, min(int(traffic_severity * 40), 40))

                if patient_location:

                    lon, lat = patient_location["coordinates"]

                    weather_data = await self.azure_maps_service.get_weather(
                        lat,
                        lon
                    )

                    precipitation = weather_data.get("precipitation_probability", 0)

                    if precipitation > 70:
                        weather_risk = 30
                    elif precipitation > 40:
                        weather_risk = 20
                    elif precipitation > 20:
                        weather_risk = 10
                    else:
                        weather_risk = 5

                route_distance = best_route.get("route", {}).get("distance_meters", 0)

                distance_km = route_distance / 1000

                if distance_km > 20:
                    distance_risk = 20
                elif distance_km > 10:
                    distance_risk = 15
                elif distance_km > 5:
                    distance_risk = 10
                else:
                    distance_risk = 5

                factors = {
                    "traffic_risk": traffic_risk,
                    "weather_risk": weather_risk,
                    "distance_risk": distance_risk
                }

                routing_latency = round((time.time() - start_routing) * 1000, 2)

                print("===== FACTOR ==========")
                print(factors)
                print("=======================")

                await self.observability_service.log_agent_decision(
                    agent_logs=agent_logs,
                    agent_name="RoutingAgent",
                    stage="environment_analysis",
                    decision="Environmental risk factors evaluated",
                    confidence=confidence,
                    latency_ms=routing_latency,
                    factors=factors
                )

        except Exception as e:
            print("ENVIRONMENT ANALYSIS ERROR:", str(e))
            raise
        #except Exception:

        #    traffic_risk = 10
        #    weather_risk = 10
        #    distance_risk = 10

        # ----------------------------
        # GOVERNANCE
        # ----------------------------

        operational_risk_index = round(
            min(1, (traffic_risk + weather_risk + distance_risk) / 100),
            2
        )

        fairness = "PASS" if len(optimized_routes) > 1 else "WARNING"
        safety = "WARNING" if operational_risk_index > 0.65 else "PASS"

        governance = {
            "fairness": fairness,
            "safety": safety,
            "privacy": "PASS",
            "transparency": "PASS",
            "accountability": "PASS",
            "operational_risk_index": operational_risk_index,
            "human_override": False,
            "override_reason": None
        }

        # ----------------------------
        # RELIABILITY
        # ----------------------------

        scores = [r["score"] for r in optimized_routes]

        if scores:
            best_score = min(scores)
            worst_score = max(scores)

            routing_confidence = 0.8 if worst_score == best_score else round(
                1 - ((best_score) / worst_score) * 0.4,
                2
            )
        else:
            routing_confidence = 0.7

        total_latency = round((time.time() - start_total) * 1000, 2)

        overall_confidence = round(
            (risk_confidence * 0.6 + routing_confidence * 0.4),
            2
        )

        reliability_score = round(
            (
                risk_confidence * 0.5 +
                routing_confidence * 0.3 -
                governance["operational_risk_index"] * 0.2
            ),
            2
        )

        reliability = {
            "decision_reliability_score": reliability_score,
            "explanation_available": True,
            "confidence_variance": round(abs(risk_confidence - routing_confidence), 2),
            "total_latency_ms": total_latency
        }

        # ----------------------------
        # SAVE TRACE
        # ----------------------------

        print("===== AGENT LOGS FINAL =====")
        for log in agent_logs:
            print(log)
        print("============================")

        await self.decision_trace_service.save_trace(
            incident_id=incident["id"],
            risk_score=risk_score,
            confidence=overall_confidence,
            governance=governance,
            reliability=reliability,
            agent_decisions=agent_logs,
            optimized_routes=optimized_routes,
            total_latency_ms=total_latency
        )

        return {
            "risk_score": risk_score,
            "confidence": overall_confidence,
            "hospital": selected_hospital,
            "eta_minutes": eta_minutes,
            "agent_decisions": agent_logs,
            "governance": governance,
            "reliability": reliability,
            "optimized_routes": optimized_routes
        }