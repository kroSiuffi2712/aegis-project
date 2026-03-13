from fastapi import APIRouter, HTTPException
from app.schemas.supervisor_schema import SupervisorCreate, SupervisorResponse
from app.services.supervisor_service import SupervisorService

router = APIRouter()
service = SupervisorService()

@router.post("/supervisors", response_model=SupervisorResponse)
async def create_supervisor(payload: SupervisorCreate):
    result = await service.create_supervisor(payload.zone_id)

    return {
        "id": result["_id"],
        **result
    }

@router.get("/supervisors/{supervisor_id}/metrics")
async def get_supervisor_metrics(supervisor_id: str):
    try:
        return await service.get_supervisor_metrics(supervisor_id)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))