from fastapi import APIRouter, HTTPException, Query
from app.services.incident_service import IncidentService
from app.services.assessment_service import AIAssessmentService
from app.schemas.incident_schema import IncidentCreate, DecisionTraceResponse
from app.schemas.incident_analytics_schema import IncidentAnalyticsResponse
from app.schemas.assessment_schema import AIAssessmentResponse
from app.schemas.agent_trace_schema import AgentTraceResponse

router = APIRouter(prefix="/incidents", tags=["Incidents"])
incident_service = IncidentService()
assessment_service = AIAssessmentService()


@router.post("/")
async def create_incident(payload: IncidentCreate):
    try:
        return await incident_service.create_incident(payload)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


# ROUTE INCIDENT
@router.post("/{incident_id}/route")
async def route_incident(incident_id: str):
    try:
        return await incident_service.route_incident(incident_id)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


# CLOSE INCIDENT
@router.post("/{incident_id}/close")
async def close_incident(incident_id: str):
    try:
        return await incident_service.close_incident(incident_id)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


# LIST INCIDENTS (MEJORADO)
@router.get("/")
async def list_incidents(
    status: str = Query(None),
    severity: str = Query(None),
    zone_id: str = Query(None),
    insurance_id: str = Query(None),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    sort_by: str = Query("created_at"),
    sort_order: str = Query("desc")
):
    try:
        return await incident_service.get_incidents(
            status=status,
            severity=severity,
            zone_id=zone_id,
            insurance_id=insurance_id,
            page=page,
            page_size=page_size,
            sort_by=sort_by,
            sort_order=sort_order
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/{incident_id}/analytics", response_model=IncidentAnalyticsResponse)
async def get_incident_analytics(incident_id: str):
    try:
        service = IncidentService()
        return await service.get_incident_analytics(incident_id)

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/{incident_id}/agent-trace", response_model=AgentTraceResponse)
async def get_agent_trace(incident_id: str):
    try:
        service = IncidentService()
        return await service.get_agent_trace(incident_id)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/{incident_id}/decision-trace", response_model=DecisionTraceResponse)
async def get_decision_trace(incident_id: str):
    try:
        service = IncidentService()
        return await service.get_decision_trace(incident_id)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/{incident_id}/ai-assessment", response_model=AIAssessmentResponse)
async def get_ai_assessment(incident_id: str):
    try:
        return await assessment_service.get_ai_assessment(incident_id)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))