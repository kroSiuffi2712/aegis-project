from app.repositories.agent_repository import AgentRepository
from app.repositories.incident_repository import IncidentRepository


class AgentService:

    def __init__(self):
        self.agent_repository = AgentRepository()
        self.incident_repository = IncidentRepository()

    async def get_agents(self):

        agents = await self.agent_repository.get_all()

        response = []

        for agent in agents:

            active_cases = await self.incident_repository.count_by_agent(
                agent["id"]
            )

            response.append({
                "id": agent["id"],
                "name": agent["name"],
                "zone": agent.get("zone", "Unknown"),
                "active_cases": active_cases
            })

        return response

    async def get_agent_metrics(self, agent_id: str):

        # Obtener info del agente (para saber su nombre)
        agent = await self.agent_repository.get_by_id(agent_id)
        if not agent:
            raise Exception("Agent not found")

        agent_name = agent["name"]

        incidents = await self.incident_repository.get_all()

        total_cases = 0
        critical_cases = 0
        latencies = []

        for incident in incidents:

            decisions = incident.get("agent_decisions", [])

            for decision in decisions:
                if decision.get("agent_name") == agent_name:

                    total_cases += 1

                    if incident.get("severity") == "High":
                        critical_cases += 1

                    latency = decision.get("latency_ms")
                    if latency is not None:
                        latencies.append(latency)

        avg_latency_ms = int(sum(latencies) / len(latencies)) if latencies else 0

        return {
            "effectiveness": 0.0,  
            "total_cases": total_cases,
            "critical_cases": critical_cases,
            "avg_latency_ms": avg_latency_ms,
            "decision_reliability": 0.0,  
            "operational_risk_index": 0.0 
        }