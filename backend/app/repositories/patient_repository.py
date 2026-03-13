from app.core.database import get_database
from datetime import datetime
import uuid


class PatientRepository:

    def __init__(self):
        self.collection_name = "patients"

    def get_collection(self):
        db = get_database()
        return db[self.collection_name]

    async def get_all_patients(self):
        collection = self.get_collection()
        return await collection.find().to_list(length=1000)

    async def get_patient_by_dni(self, dni: str):
        collection = self.get_collection()
        return await collection.find_one({"dni": dni})

    async def create_patient(self, data: dict):

        collection = self.get_collection()

        patient_data = {
            "_id": str(uuid.uuid4()),
            "first_name": data["first_name"],
            "last_name": data["last_name"],
            "dni": data["dni"],
            "phone": data["phone"],
            "address": data["address"],
            "insurance_id": data["insurance_id"],
            "created_at": datetime.utcnow()
        }

        await collection.insert_one(patient_data)

        return patient_data