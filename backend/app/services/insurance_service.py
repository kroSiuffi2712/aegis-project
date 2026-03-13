from app.repositories.insurance_repository import InsuranceRepository
from app.repositories.clinic_repository import ClinicRepository
from app.schemas.insurance_schema import InsuranceCreate


class InsuranceService:

    def __init__(self):
        self.insurance_repository = InsuranceRepository()
        self.clinic_repository = ClinicRepository()

    async def create_insurance(self, payload: InsuranceCreate):
        return await self.insurance_repository.create_insurance(
            payload.model_dump() 
        )

    async def get_all_insurances(self):
        return await self.insurance_repository.get_all_insurances()

    async def add_clinic(self, insurance_id: str, clinic_id: str):


        insurance = await self.insurance_repository.get_by_id(insurance_id)
        if not insurance:
            raise ValueError("Insurance not found")


        clinic = await self.clinic_repository.get_by_id(clinic_id)
        if not clinic:
            raise ValueError("Clinic not found")


        return await self.insurance_repository.add_clinic_to_insurance(
            insurance_id,
            clinic_id
        )


    async def get_clinics(self, insurance_id: str):
        return await self.insurance_repository.get_clinics_for_insurance(insurance_id)