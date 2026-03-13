from fastapi import APIRouter
from app.schemas.zone_schema import ZoneCreate, ZoneResponse
from app.services.zone_service import ZoneService
from app.services.zone_health_service import ZoneHealthService

router = APIRouter()
service = ZoneService()

@router.post("/zones", response_model=ZoneResponse)
async def create_zone(payload: ZoneCreate):
    return await service.create_zone(payload)

@router.get("/zones", response_model=list[ZoneResponse])
async def list_zones():
    zones = await service.list_zones()
    return zones

@router.get("/zones/{zone_id}/health")
async def get_zone_health(zone_id: str):
    service = ZoneHealthService()
    return await service.get_zone_health(zone_id)
    