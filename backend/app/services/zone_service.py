from app.repositories.zone_repository import ZoneRepository
from app.schemas.zone_schema import ZoneCreate


class ZoneService:

    def __init__(self):
        self.repository = ZoneRepository()

    async def create_zone(self, zone: ZoneCreate):
        zone_data = zone.dict() 

        return await self.repository.create_zone(zone_data)

    async def list_zones(self):
        return await self.repository.get_all_zones()