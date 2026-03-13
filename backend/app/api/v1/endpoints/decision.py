from fastapi import APIRouter
from app.services.decision_trace_service import DecisionTraceService

router = APIRouter()
service = DecisionTraceService()

@router.get("/decisions/{incident_id}/traces")
async def get_decision_trace(incident_id: str):

    return await service.get_decision_trace_by_incident(incident_id)