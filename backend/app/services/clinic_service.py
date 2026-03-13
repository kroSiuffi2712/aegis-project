from app.repositories.clinic_repository import ClinicRepository
from app.repositories.insurance_repository import InsuranceRepository


class ClinicService:

    def __init__(self):
        self.clinic_repository = ClinicRepository()
        self.insurance_repository = InsuranceRepository()

    # create a clinic
    async def create_clinic(self, payload):
        return await self.clinic_repository.create_clinic(payload.model_dump())

    # get all clinics
    async def get_all_clinics(self):
        return await self.clinic_repository.get_all_clinics()

    # get a clinic by insurance
    async def get_clinics_by_insurance(self, insurance_id: str):

        insurance = await self.insurance_repository.get_by_id(insurance_id)

        if not insurance:
            raise Exception("Insurance not found")

        clinic_ids = insurance.get("clinic_ids", [])

        clinics = await self.clinic_repository.get_by_ids(clinic_ids)

        return clinics