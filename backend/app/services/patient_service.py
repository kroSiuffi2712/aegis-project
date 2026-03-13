from app.repositories.patient_repository import PatientRepository
from app.schemas.patient_schema import PatientCreate


class PatientService:

    def __init__(self):
        self.repository = PatientRepository()

    async def get_patients(self):

        patients = await self.repository.get_all_patients()

        for patient in patients:
            patient["id"] = str(patient.pop("_id"))

        return patients

    async def create_patient(self, payload: PatientCreate):

        existing_patient = await self.repository.get_patient_by_dni(payload.dni)

        if existing_patient:
            existing_patient["id"] = str(existing_patient.pop("_id"))
            return existing_patient

        patient = await self.repository.create_patient(payload.model_dump())

        patient["id"] = str(patient.pop("_id"))

        return patient