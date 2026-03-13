from datetime import datetime
from app.core.database import get_database
import uuid


class ZoneRepository:
    def __init__(self):
        self.collection_name = "zones"

    def get_collection(self):
        db = get_database()
        return db[self.collection_name]

    def get_by_id(self, zone_id: str):
        collection = self.get_collection()
        return collection.find_one({"_id": zone_id})

    def _to_geojson_polygon(self, coordinates: list):

        geo_coords = [[c["lng"], c["lat"]] for c in coordinates]

        # Cerrar polígono si no está cerrado
        if geo_coords[0] != geo_coords[-1]:
            geo_coords.append(geo_coords[0])

        return {
            "type": "Polygon",
            "coordinates": [geo_coords]
        }

    async def create_zone(self, data: dict):
        collection = self.get_collection()

        coordinates = data.pop("coordinates")

        zone_data = {
            "_id": str(uuid.uuid4()),  
            "name": data["name"],
            "incident_limit": data["incident_limit"],
            "geometry": self._to_geojson_polygon(coordinates),
            "created_at": datetime.utcnow(),
            "active_incidents": 0,
            "supervisor_agents": []
        }

        await collection.insert_one(zone_data)


        response = {
            "id": zone_data["_id"],
            "name": zone_data["name"],
            "incident_limit": zone_data["incident_limit"],
            "coordinates": coordinates,
            "created_at": zone_data["created_at"],
            "active_incidents": zone_data["active_incidents"],
            "supervisor_agents": zone_data["supervisor_agents"],
        }

        return response

    async def get_all_zones(self):
        collection = self.get_collection()
        zones = []

        async for zone in collection.find():

            coordinates = []
            if "geometry" in zone and "coordinates" in zone["geometry"]:
                polygon = zone["geometry"]["coordinates"][0]

                coordinates = [
                    {
                        "lat": coord[1],
                        "lng": coord[0]
                    }
                    for coord in polygon[:-1]  
                ]

            response = {
                "id": str(zone["_id"]),
                "name": zone.get("name"),
                "incident_limit": zone.get("incident_limit"),
                "coordinates": coordinates,
                "created_at": zone.get("created_at"),
                "active_incidents": zone.get("active_incidents", 0),
                "supervisor_agents": zone.get("supervisor_agents", []),
            }

            zones.append(response)

        return zones