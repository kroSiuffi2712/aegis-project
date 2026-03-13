from datetime import datetime
from app.core.database import get_database
import uuid


class InsuranceRepository:

    def __init__(self):
        self.collection_name = "insurances"

    def get_collection(self):
        db = get_database()
        return db[self.collection_name]

    # get clinics
    def get_clinic_collection(self):
        db = get_database()
        return db["clinics"]

    # get a insurance by id
    async def get_by_id(self, insurance_id: str):
        collection = self.get_collection()
        return await collection.find_one({"_id": insurance_id})

    # create a insurance
    async def create_insurance(self, data: dict):
        collection = self.get_collection()

        insurance_data = {
            "_id": str(uuid.uuid4()),
            "nit": data["nit"],
            "name": data["name"],
            "clinic_ids": data.get("clinic_ids", []),
            "active": True,
            "created_at": datetime.utcnow()
        }

        await collection.insert_one(insurance_data)

        return {
            "id": insurance_data["_id"],
            "nit": insurance_data["nit"],
            "name": insurance_data["name"],
            "clinic_ids": insurance_data["clinic_ids"],
            "active": insurance_data["active"],
            "created_at": insurance_data["created_at"],
        }

    # get all insurances
    async def get_all_insurances(self):
        collection = self.get_collection()
        insurances = []

        async for insurance in collection.find():
            insurances.append({
                "id": insurance["_id"],
                "nit": insurance.get("nit"),
                "name": insurance.get("name"),
                "clinic_ids": insurance.get("clinic_ids", []),
                "active": insurance.get("active", True),
                "created_at": insurance.get("created_at"),
            })

        return insurances

    # add clinics to insurance
    async def add_clinic_to_insurance(self, insurance_id: str, clinic_id: str):

        insurance_collection = self.get_collection()
        clinic_collection = self.get_clinic_collection()

        # check insurance
        insurance = await insurance_collection.find_one({"_id": insurance_id})
        if not insurance:
            raise Exception("Insurance not found")

        if not insurance.get("active", True):
            raise Exception("Insurance is inactive")

        # check a clinic
        clinic = await clinic_collection.find_one({"_id": clinic_id})
        if not clinic:
            raise Exception("Clinic not found")

        if not clinic.get("active", True):
            raise Exception("Clinic is inactive")

        # update a insurance
        await insurance_collection.update_one(
            {"_id": insurance_id},
            {"$addToSet": {"clinic_ids": clinic_id}}
        )

        return {"message": "Clinic added successfully"}

    # get clinics
    async def get_clinics_for_insurance(self, insurance_id: str):

        insurance_collection = self.get_collection()
        clinic_collection = self.get_clinic_collection()

        insurance = await insurance_collection.find_one({"_id": insurance_id})

        if not insurance:
            raise Exception("Insurance not found")

        clinic_ids = insurance.get("clinic_ids", [])

        if not clinic_ids:
            return []

        clinics = []

        async for clinic in clinic_collection.find({
            "_id": {"$in": clinic_ids},
            "active": True
        }):

            coordinates = clinic["location"]["coordinates"]

            clinics.append({
                "id": clinic["_id"],
                "nit": clinic.get("nit"),
                "name": clinic.get("name"),
                "location": {
                    "lat": coordinates[1],
                    "lng": coordinates[0]
                }
            })

        return clinics