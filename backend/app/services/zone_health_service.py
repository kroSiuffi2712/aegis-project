from datetime import datetime
from app.repositories.zone_repository import ZoneRepository
from app.repositories.supervisor_repository import SupervisorRepository


class ZoneHealthService:

    def __init__(self):
        self.zone_repo = ZoneRepository()
        self.supervisor_repo = SupervisorRepository()

    async def get_zone_health(self, zone_id: str):

        zone = await self.zone_repo.get_by_id(zone_id)

        if not zone:
            return None

        supervisors = await self.supervisor_repo.get_active_by_zone(zone_id)

        active_supervisors = len(supervisors)
        active_incidents = zone.get("active_incidents", 0)
        incident_limit = zone.get("incident_limit", 0)

        if active_supervisors > 0:
            max_per_supervisor = incident_limit // active_supervisors
        else:
            max_per_supervisor = 0

        occupancy_percentage = (
            round((active_incidents / incident_limit) * 100, 2)
            if incident_limit > 0
            else 0
        )

        if occupancy_percentage < 70:
            status = "healthy"
        elif occupancy_percentage < 90:
            status = "warning"
        else:
            status = "critical"

        return {
            "status": status,
            "zone_id": zone_id,
            "incident_limit": incident_limit,
            "active_incidents": active_incidents,
            "active_supervisors": active_supervisors,
            "max_incidents_per_supervisor": max_per_supervisor,
            "occupancy_percentage": occupancy_percentage,
            "timestamp": datetime.utcnow().isoformat()
        }