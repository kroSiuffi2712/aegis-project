import random
from datetime import datetime

class RiskAgent:

    async def evaluate(self, incident: dict) -> dict:

        return {
            "severity": "High",
            "risk_score": round(random.uniform(0.6, 0.95), 2),
            "confidence": round(random.uniform(0.75, 0.98), 2),
            "risk_factors": [
                {"factor": "symptom_keyword_match", "impact": "+15%"},
                {"factor": "age_threshold", "impact": "+10%"}
            ],
            "latency_ms": random.randint(100, 200),
            "timestamp": datetime.utcnow()
        }