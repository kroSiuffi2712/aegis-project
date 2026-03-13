import math
from app.core.database import get_database
from app.services.insurance_service import InsuranceService


class RoutingService:

    def __init__(self):
        self.insurance_service = InsuranceService()

    def calculate_distance_km(self, lat1, lon1, lat2, lon2):
        R = 6371 

        dlat = math.radians(lat2 - lat1)
        dlon = math.radians(lon2 - lon1)

        a = (
            math.sin(dlat / 2) ** 2
            + math.cos(math.radians(lat1))
            * math.cos(math.radians(lat2))
            * math.sin(dlon / 2) ** 2
        )

        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
        return R * c

    async def assign_best_clinic(self, incident_id: str):

        db = get_database()

        incident = await db["incidents"].find_one({"_id": incident_id})
        if not incident:
            raise Exception("Incident not found")

        if incident.get("assigned_clinic_id"):
            return {"message": "Clinic already assigned"}

        insurance_id = incident.get("insurance_id")
        if not insurance_id:
            raise Exception("Incident has no insurance")

        clinics = await self.insurance_service.get_clinics(insurance_id)

        if not clinics:
            raise Exception("No affiliated clinics found")

        incident_coords = incident["location"]["coordinates"]
        incident_lat = incident_coords[1]
        incident_lng = incident_coords[0]

        best_clinic = None
        min_distance = float("inf")

        for clinic in clinics:
            clinic_lat = clinic["location"]["lat"]
            clinic_lng = clinic["location"]["lng"]

            distance = self.calculate_distance_km(
                incident_lat,
                incident_lng,
                clinic_lat,
                clinic_lng
            )

            if distance < min_distance:
                min_distance = distance
                best_clinic = clinic

        await db["incidents"].update_one(
            {"_id": incident_id},
            {
                "$set": {
                    "assigned_clinic_id": best_clinic["id"],
                    "estimated_distance": round(min_distance, 2),
                    "status": "assigned"
                }
            }
        )

        return {
            "assigned_clinic_id": best_clinic["id"],
            "estimated_distance_km": round(min_distance, 2)
        }