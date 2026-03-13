from fastapi import APIRouter, HTTPException
from app.schemas.insurance_schema import InsuranceCreate, InsuranceResponse
from app.services.insurance_service import InsuranceService

router = APIRouter()
service = InsuranceService()


# Crear insurance
@router.post("/insurances", response_model=InsuranceResponse)
async def create_insurance(payload: InsuranceCreate):
    try:
        return await service.create_insurance(payload)  # ✅ typo corregido
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


# Listar todos
@router.get("/insurances", response_model=list[InsuranceResponse])
async def list_insurances():
    return await service.get_all_insurances()


# Agregar clínica a insurance
@router.post("/insurances/{insurance_id}/clinics/{clinic_id}")
async def add_clinic_to_insance(insurance_id: str, clinic_id: str):
    try:
        return await service.add_clinic(insurance_id, clinic_id)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


# Obtener clínicas asociadas
@router.get("/insurances/{insurance_id}/clinics")
async def get_clinics_for_insurance(insurance_id: str):
    try:
        return await service.get_clinics(insurance_id)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))