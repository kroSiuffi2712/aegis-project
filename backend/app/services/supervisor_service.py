import uuid
from datetime import datetime
from app.core.database import get_database
from app.repositories.supervisor_repository import SupervisorRepository
from app.repositories.incident_repository import IncidentRepository


class SupervisorService:

    def __init__(self):
        self.supervisor_repository = SupervisorRepository()
        self.incident_repository = IncidentRepository()

    async def assign_supervisor(self, zone: dict) -> dict:
        db = get_database()
        collection = db["supervisors"]

        zone_id = str(zone["_id"])

        supervisors = await collection.find({
            "zone_id": zone_id,
            "active": True
        }).to_list(None)

        if not supervisors:
            return await self.create_supervisor(zone_id)

        supervisor = min(supervisors, key=lambda s: s["incident_count"])

        if supervisor["incident_count"] >= zone["incident_limit"]:
            return await self.create_supervisor(zone_id)

        await collection.update_one(
            {"_id": supervisor["_id"]},
            {"$inc": {"incident_count": 1}}
        )

        supervisor["incident_count"] += 1
        return supervisor

    async def create_supervisor(self, zone_id: str) -> dict:
        db = get_database()
        collection = db["supervisors"]

        supervisor = {
            "_id": str(uuid.uuid4()),
            "zone_id": zone_id,
            "active": True,
            "incident_count": 1,
            "created_at": datetime.utcnow()
        }

        await collection.insert_one(supervisor)
        return supervisor

    async def get_supervisor_metrics(self, supervisor_id: str):

        supervisor = await self.supervisor_repository.get_by_id(supervisor_id)

        if not supervisor:
            raise Exception("Supervisor not found")

        if not supervisor.get("active", False):
            raise Exception("Supervisor is not active")

        incidents = await self.incident_repository.get_by_supervisor_id(supervisor_id)

        total_cases = len(incidents)

        if total_cases == 0:
            return {
                "supervisor_id": supervisor_id,
                "zone_id": supervisor.get("zone_id"),
                "total_cases": 0,
                "effectiveness": 0,
                "avg_latency_ms": 0,
                "decision_reliability": 0,
                "operational_risk_index": 0,
                "status_breakdown": {
                    "open": 0,
                    "routed": 0,
                    "closed": 0
                }
            }

        all_decisions = []
        total_latency = 0.0
        total_risk_score = 0.0

        status_breakdown = {
            "open": 0,
            "routed": 0,
            "closed": 0
        }

        for incident in incidents:

            # ---- STATUS ----
            status = incident.get("status", "open")
            if status in status_breakdown:
                status_breakdown[status] += 1

            # ---- RISK SCORE  ----
            risk_score = incident.get("risk_score")
            if isinstance(risk_score, (int, float)):
                total_risk_score += risk_score

            # ---- DECISIONES ----
            decisions = incident.get("agent_decisions", [])

            for d in decisions:
                all_decisions.append(d)

                latency = d.get("latency_ms")
                if isinstance(latency, (int, float)):
                    total_latency += latency

        # ---- MÉTRICAS ----

        avg_latency = (
            total_latency / len(all_decisions)
            if all_decisions else 0
        )

        effectiveness = (
            status_breakdown["closed"] / total_cases
        )

        decision_reliability = (
            sum(
                d.get("confidence", 0)
                for d in all_decisions
                if isinstance(d.get("confidence"), (int, float))
            ) / len(all_decisions)
            if all_decisions else 0
        )

        operational_risk_index = (
            total_risk_score / total_cases
            if total_cases > 0 else 0
        )

        return {
            "supervisor_id": supervisor_id,
            "zone_id": supervisor.get("zone_id"),
            "total_cases": total_cases,
            "effectiveness": round(effectiveness, 2),
            "avg_latency_ms": round(avg_latency, 2),
            "decision_reliability": round(decision_reliability, 2),
            "operational_risk_index": round(operational_risk_index, 2),
            "status_breakdown": status_breakdown
        }