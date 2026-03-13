from fastapi import APIRouter
from typing import List

from app.services.dispatch.dispatch_engine import dispatch
from app.schemas.dispatch_schema import (
    Location,
    Ambulance,
    Clinic
)

router = APIRouter()


@router.post("/incident")
async def dispatch_incident(
    patient_location: Location,
    ambulances: List[Ambulance],
    clinics: List[Clinic]
):

    result = await dispatch(
        patient_location=patient_location,
        ambulances=ambulances,
        clinics=clinics
    )

    return result