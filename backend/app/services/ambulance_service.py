from app.repositories.ambulance_repository import AmbulanceRepository


class AmbulanceService:

    def __init__(self):
        self.repository = AmbulanceRepository()

    # Create
    async def create_ambulance(self, payload):
        ambulance_data = payload.model_dump()
        ambulance = await self.repository.create_ambulance(ambulance_data)
        return self._map_response(ambulance)

    # List
    async def get_ambulances(
        self,
        status: str = None,
        zone_id: str = None,
        clinic_id: str = None,
        assigned_incident_id: str = None,  
        page: int = 1,
        page_size: int = 20,
        sort_by: str = "created_at",
        sort_order: str = "desc"
    ):
        return await self.repository.search_ambulances(
            status=status,
            zone_id=zone_id,
            clinic_id=clinic_id,
            assigned_incident_id=assigned_incident_id,  
            page=page,
            page_size=page_size,
            sort_by=sort_by,
            sort_order=sort_order
        )

    # Update
    async def update_ambulance(self, ambulance_id: str, payload):
        update_data = payload.model_dump(exclude_none=True)

        ambulance = await self.repository.update_ambulance(
            ambulance_id,
            update_data
        )

        if not ambulance:
            raise Exception("Ambulance not found")

        return self._map_response(ambulance)

    # Mapper interno
    def _map_response(self, ambulance: dict):
        return {
            "id": ambulance["_id"],
            "plate": ambulance["plate"],
            "driver_name": ambulance["driver_name"],
            "status": ambulance["status"],
            "location": ambulance["location"],
            "company": ambulance["company"],
            "created_at": ambulance["created_at"],
            "updated_at": ambulance.get("updated_at")
        }

    async def get_by_id(self, ambulance_id: str):

        ambulance = await self.repository.get_by_id(ambulance_id)

        return ambulance