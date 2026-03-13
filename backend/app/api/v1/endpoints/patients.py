from fastapi import APIRouter
from app.services.patient_service import PatientService
from app.schemas.patient_schema import PatientCreate

router = APIRouter()
service = PatientService()


@router.get("/patients")
async def get_patients():
    return await service.get_patients()


@router.post("/patients")
async def create_patient(payload: PatientCreate):
    return await service.create_patient(payload)