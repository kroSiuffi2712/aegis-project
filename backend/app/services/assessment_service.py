import random
from datetime import datetime
from app.core.database import get_database


CLINICAL_FACTORS = [
    "Age",
    "Severe Chest Pain",
    "Shortness of Breath",
    "Onset 20 min ago",
    "Hypertension History",
    "Diabetes",
    "Loss of Consciousness",
    "Irregular Pulse",
    "Oxygen Saturation < 90%",
    "High Fever",
    "Stroke Symptoms",
    "Head Trauma",
    "Severe Bleeding",
    "Pregnancy",
    "Allergic Reaction",
    "Cardiac History",
    "Low Blood Pressure",
    "High Respiratory Rate",
    "Seizure Activity",
    "Extreme Anxiety"
]


class AIAssessmentService:

    async def save_assessment(self, incident_id, triage_result):

        db = get_database()

        assessment = {
            "incident_id": incident_id,
            "agent_name": "EmergencyTriageAgent",
            "model_version": triage_result.get("model_version"),
            "risk_score": triage_result.get("risk_score"),
            "confidence": triage_result.get("confidence"),
            "urgency_level": triage_result.get("urgency_level"),
            "incident_type": triage_result.get("incident_type"),
            "category": triage_result.get("category"),
            "criticality_level": triage_result.get("criticality_level"),
            "critical_metrics": triage_result.get("critical_metrics", []),
            "factor_escalation_projection": triage_result.get("factor_escalation_projection", []),
            "created_at": datetime.utcnow()
        }

        print("CRITICAL METRICS:", triage_result.get("critical_metrics"))
        print("PROJECTION:", triage_result.get("factor_escalation_projection"))

        await db["ai_assessments"].update_one(
            {"incident_id": incident_id},
            {"$set": assessment},
            upsert=True
        )

        return {
            "risk_score": triage_result.get("risk_score"),
            "urgency_level": triage_result.get("urgency_level"),
            "confidence": triage_result.get("confidence"),
            "critical_metrics": triage_result.get("critical_metrics", [])
        }

    async def get_ai_assessment(self, incident_id: str):

        db = get_database()

        assessment = await db["ai_assessments"].find_one(
            {"incident_id": incident_id},
            {"_id": 0}
        )

        if not assessment:
            raise Exception("AI assessment not found")

        return assessment


    def generate_factor_projection(self, critical_metrics):

        projection = []

        time_steps = [0, 3, 6]

        for minute in time_steps:

            factors = []

            for metric in critical_metrics:

                base = metric["risk_delta"] * 100

                escalation = base + (minute * random.uniform(1.5, 3.5))

                factors.append({
                    "parameter": metric["parameter"],
                    "level": round(min(escalation, 100), 2)
                })

            projection.append({
                "minute": minute,
                "factors": factors
            })

        return projection