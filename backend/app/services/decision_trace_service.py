from fastapi import HTTPException, status
from datetime import datetime

from app.repositories.decision_trace_repository import DecisionTraceRepository
from app.repositories.incident_repository import IncidentRepository


class DecisionTraceService:

    def __init__(self):
        self.decision_trace_repository = DecisionTraceRepository()
        self.incident_repository = IncidentRepository()

    # Save decision trace
    async def save_trace(self, **trace_data):

        trace_document = {
            **trace_data,
            "created_at": datetime.utcnow()
        }

        return await self.decision_trace_repository.create_trace(
            trace_document
        )

    # Get trace by incident
    async def get_decision_trace_by_incident(self, incident_id: str):

        # Validate that the incident exists
        incident = await self.incident_repository.get_by_id(incident_id)

        if not incident:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Incident not found"
            )

        decision_trace = await self.decision_trace_repository.get_by_incident_id(
            incident_id
        )

        if not decision_trace:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Decision trace not found for this incident"
            )

        return decision_trace