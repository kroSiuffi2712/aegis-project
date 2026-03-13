from datetime import datetime
from app.repositories.health_repository import HealthRepository


class HealthService:

    def __init__(self):
        self.repo = HealthRepository()

    async def get_operational_status(self, zone_id: str):

        zone_data = await self.repo.get_zone_capacity(zone_id)
        metrics = await self.repo.get_incident_metrics(zone_id)

        incident_limit = zone_data["incident_limit"]
        active_incidents = metrics["active_incidents"]

        occupancy_percentage = (
            round((active_incidents / incident_limit) * 100, 2)
            if incident_limit > 0 else 0
        )

        if occupancy_percentage >= 80:
            system_load_status = "critical"
        elif occupancy_percentage >= 50:
            system_load_status = "warning"
        else:
            system_load_status = "normal"

        return {
            "status": "operational",
            "zone_id": zone_id,
            "zone_name": zone_data["zone_name"],
            "incident_limit": incident_limit,
            **metrics,
            "occupancy_percentage": occupancy_percentage,
            "system_load_status": system_load_status,
            "timestamp": datetime.utcnow()
        }