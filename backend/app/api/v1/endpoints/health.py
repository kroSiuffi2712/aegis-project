from fastapi import APIRouter, Query, HTTPException
from app.services.health_service import HealthService

router = APIRouter()


@router.get("/health")
async def health_status(
    zone_id: str = Query(None, description="Filter metrics by zone_id")
):

    try:
        service = HealthService()
        return await service.get_operational_status(zone_id=zone_id)

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))