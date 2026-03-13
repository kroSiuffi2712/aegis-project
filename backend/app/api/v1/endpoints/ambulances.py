from fastapi import APIRouter, HTTPException, Query
from typing import List

from app.schemas.ambulance_schema import (
    AmbulanceCreate,
    AmbulanceUpdate,
    AmbulanceResponse
)
from app.services.ambulance_service import AmbulanceService


router = APIRouter()
service = AmbulanceService()


# CREATE
@router.post("/ambulances", response_model=AmbulanceResponse)
async def create_ambulance(payload: AmbulanceCreate):
    try:
        return await service.create_ambulance(payload)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))



@router.get("/ambulances")
async def list_ambulances(
    status: str = Query(None),
    zone_id: str = Query(None),
    assigned_incident_id: str = Query(None),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    sort_by: str = Query("updated_at"),
    sort_order: str = Query("desc")
):
    try:
        return await service.get_ambulances(
            status=status,
            zone_id=zone_id,
            assigned_incident_id=assigned_incident_id,
            page=page,
            page_size=page_size,
            sort_by=sort_by,
            sort_order=sort_order
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


# UPDATE
@router.put("/ambulances/{ambulance_id}", response_model=AmbulanceResponse)
async def update_ambulance(ambulance_id: str, payload: AmbulanceUpdate):
    try:
        return await service.update_ambulance(ambulance_id, payload)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))