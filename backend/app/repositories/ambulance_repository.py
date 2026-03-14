from pymongo import ReturnDocument
from datetime import datetime
from app.core.database import get_database
import uuid


class AmbulanceRepository:

    def __init__(self):
        self.collection_name = "ambulances"

    def get_collection(self):
        db = get_database()
        return db[self.collection_name]

    # Create
    async def create_ambulance(self, ambulance_data: dict):
        collection = self.get_collection()

        ambulance_data["_id"] = str(uuid.uuid4())
        ambulance_data["created_at"] = datetime.utcnow()
        ambulance_data["updated_at"] = None

        await collection.insert_one(ambulance_data)

        return ambulance_data

    # Search / List
    async def search_ambulances(
        self,
        status: str = None,
        zone_id: str = None,
        assigned_incident_id: str = None, 
        clinic_id: str = None,
        page: int = 1,
        page_size: int = 20,
        sort_by: str = "created_at",
        sort_order: str = "desc"
    ):
        collection = self.get_collection()

        filters = {}

        if status:
            filters["status"] = status

        if zone_id:
            filters["zone_id"] = zone_id

        if clinic_id:
            filters["clinic_id"] = clinic_id
        
        if assigned_incident_id:
            filters["assigned_incident_id"] = assigned_incident_id

        skip = (page - 1) * page_size

        sort_direction = -1 if sort_order == "desc" else 1

        cursor = (
            collection.find(filters)
            .sort(sort_by, sort_direction)
            .skip(skip)
            .limit(page_size)
        )

        results = []
        async for document in cursor:
            document["id"] = document.pop("_id")
            results.append(document)

        total = await collection.count_documents(filters)

        return {
            "success": True,
            "data": results,
            "pagination": {
                "page": page,
                "page_size": page_size,
                "total": total
            }
        }

    # Update
    async def update_ambulance(self, ambulance_id: str, update_data: dict):
        collection = self.get_collection()

        update_data["updated_at"] = datetime.utcnow()

        result = await collection.find_one_and_update(
            {"_id": ambulance_id},
            {"$set": update_data},
            return_document=ReturnDocument.AFTER
        )

        return result
    
    # Get available ambulances for dispatch
    async def get_available_ambulances(self):

        collection = self.get_collection()

        cursor = collection.find(
            {
                "status": "available"
            },
            {
                "_id": 1,
                "status": 1,
                "location": 1,
                "clinic_id": 1,
                "zone_id": 1
            }
        )

        results = []

        async for doc in cursor:

            location = doc.get("location", {})
            coords = location.get("coordinates", [])

            lon = coords[0] if len(coords) > 0 else None
            lat = coords[1] if len(coords) > 1 else None

            results.append({
                "id": doc["_id"],
                "status": doc.get("status"),
                "lat": lat,
                "lon": lon,
                "clinic_id": doc.get("clinic_id"),
                "zone_id": doc.get("zone_id")
            })

        return results

    async def get_by_id(self, ambulance_id: str):

        collection = self.get_collection()

        ambulance = await collection.find_one(
            {"_id": ambulance_id}
        )

        if ambulance:
            ambulance["id"] = ambulance.pop("_id")

        return ambulance