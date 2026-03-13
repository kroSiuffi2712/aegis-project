from fastapi import APIRouter
from app.schemas.clinic_schema import ClinicCreate, ClinicResponse
from app.services.clinic_service import ClinicService

router = APIRouter()
service = ClinicService()


@router.post("/clinics", response_model=ClinicResponse)
async def create_clinic(payload: ClinicCreate):
    return await service.create_clinic(payload)


@router.get("/clinics", response_model=list[ClinicResponse])
async def list_clinics():
    return await service.get_all_clinics()