from datetime import datetime
from app.core.database import get_database
import uuid


class ClinicRepository:
    def __init__(self):
        self.collection_name = "clinics"

    def get_collection(self):
        db = get_database()
        return db[self.collection_name]

    #  {lat, lng} to GeoJSON
    def _to_geojson_point(self, location: dict):
        return {
            "type": "Point",
            "coordinates": [location["lng"], location["lat"]]
        }

    # eoJSON to frontend
    def _from_geojson_point(self, geojson: dict):
        if not geojson or "coordinates" not in geojson:
            return None

        coordinates = geojson["coordinates"]

        return {
            "lat": coordinates[1],
            "lng": coordinates[0]
        }

    # Get Clinics by Id
    async def get_by_id(self, clinic_id: str):
        collection = self.get_collection()
        clinic = await collection.find_one({"_id": clinic_id})

        if not clinic:
            return None

        return {
            "id": clinic["_id"],
            "nit": clinic.get("nit"),
            "name": clinic.get("name"),
            "location": self._from_geojson_point(clinic.get("location")),
            "active": clinic.get("active", True),
            "created_at": clinic.get("created_at")
        }

    # create a clinic
    async def create_clinic(self, data: dict):
        collection = self.get_collection()

        location = data.pop("location")

        clinic_data = {
            "_id": str(uuid.uuid4()),
            "nit": data["nit"],
            "name": data["name"],
            "location": self._to_geojson_point(location),
            "active": True,
            "created_at": datetime.utcnow()
        }

        await collection.insert_one(clinic_data)

        return {
            "id": clinic_data["_id"],
            "nit": clinic_data["nit"],
            "name": clinic_data["name"],
            "location": location,
            "active": clinic_data["active"],
            "created_at": clinic_data["created_at"]
        }

    # get clinics
    async def get_all_clinics(self):
        collection = self.get_collection()
        clinics = []

        async for clinic in collection.find():
            clinics.append({
                "id": clinic["_id"],
                "nit": clinic.get("nit"),
                "name": clinic.get("name"),
                "location": self._from_geojson_point(clinic.get("location")),
                "active": clinic.get("active", True),
                "created_at": clinic.get("created_at")
            })

        return clinics