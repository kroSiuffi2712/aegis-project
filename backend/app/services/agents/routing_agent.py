import random
from datetime import datetime

class RoutingAgent:

    async def optimize(self, incident: dict, risk: dict) -> dict:

        return {
            "selected_hospital": "Central Hospital",
            "eta_minutes": random.randint(5, 15),
            "routing_confidence": round(random.uniform(0.7, 0.95), 2),
            "latency_ms": random.randint(80, 150),
            "timestamp": datetime.utcnow()
        }