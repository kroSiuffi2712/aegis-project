import random
from datetime import datetime


class EmergencyTriageAgent:

    def __init__(self):
        pass

    async def evaluate(self, incident: dict):

        patient = incident["patient"]
        symptoms = incident["symptoms_summary"]

        risk_score = round(random.uniform(0.4, 0.95), 2)

        if risk_score < 0.5:
            urgency = "LOW"
        elif risk_score < 0.7:
            urgency = "MEDIUM"
        elif risk_score < 0.85:
            urgency = "HIGH"
        else:
            urgency = "CRITICAL"

        confidence = round(random.uniform(0.75, 0.96), 2)

        reasoning = f"Simulated triage evaluation for symptoms: {symptoms}"

        return {
            "risk_score": risk_score,
            "urgency_level": urgency,
            "confidence": confidence,
            "reasoning": reasoning,
            "timestamp": datetime.utcnow()
        }


        """
        prompt = f'''
        You are an emergency medical triage AI.

        Evaluate the severity of this emergency incident.

        Patient age: {patient.get("age")}
        Symptoms: {symptoms}

        Return JSON with:
        risk_score (0-1)
        urgency_level (LOW, MEDIUM, HIGH, CRITICAL)
        confidence (0-1)
        reasoning
        '''

        ai_response = await self.ai_foundry.generate(prompt)

        return {
            "risk_score": ai_response["risk_score"],
            "urgency_level": ai_response["urgency_level"],
            "confidence": ai_response["confidence"],
            "reasoning": ai_response["reasoning"],
            "timestamp": datetime.utcnow()
        }
        """