from datetime import datetime
from app.core.database import get_database
import uuid


class SupervisorRepository:

    def __init__(self):
        self.collection_name = "supervisors"

    def get_collection(self):
        db = get_database()
        return db[self.collection_name]


    async def create_supervisor(self, zone_id: str):
        collection = self.get_collection()

        data = {
            "_id": str(uuid.uuid4()),
            "zone_id": zone_id,
            "active": True,                
            "incident_count": 0,           
            "created_at": datetime.utcnow()
        }

        await collection.insert_one(data)

        return data


    async def get_active_by_zone(self, zone_id: str):
        collection = self.get_collection()

        cursor = collection.find({
            "zone_id": zone_id,
            "active": True
        })

        return await cursor.to_list(length=None)


    async def increment_incident_count(self, supervisor_id: str):
        collection = self.get_collection()

        await collection.update_one(
            {"_id": supervisor_id},
            {"$inc": {"incident_count": 1}}
        )


    async def decrement_incident_count(self, supervisor_id: str):
        collection = self.get_collection()

        await collection.update_one(
            {"_id": supervisor_id},
            {"$inc": {"incident_count": -1}}
        )


    async def deactivate_supervisor(self, supervisor_id: str):
        collection = self.get_collection()

        await collection.update_one(
            {"_id": supervisor_id},
            {
                "$set": {
                    "active": False,
                    "deactivated_at": datetime.utcnow()
                }
            }
        )

    async def get_by_id(self, supervisor_id: str):
        collection = self.get_collection()
        return await collection.find_one({"_id": supervisor_id})