import httpx
import os
from app.core.config import get_settings

settings = get_settings()

AZURE_MAPS_KEY = settings.AZURE_MAPS_KEY
BASE_URL = settings.AZURE_MAPS_URL


class AzureMapsClient:

    async def distance_matrix(self, origins, destinations):

        url = f"{BASE_URL}/route/matrix/json"
        print("AZURE_MAPS_URL:", BASE_URL)
        print("route complete:", url)

        body = {
            "origins": {
                "type": "MultiPoint",
                "coordinates": [[o.lon, o.lat] for o in origins]
            },
            "destinations": {
                "type": "MultiPoint",
                "coordinates": [[d.lon, d.lat] for d in destinations]
            }
        }

        params = {
            "api-version": "1.0",
            "subscription-key": AZURE_MAPS_KEY
        }

        async with httpx.AsyncClient() as client:
            r = await client.post(url, params=params, json=body)

        return r.json()

    async def get_routes(self, origin, destination, alternatives=3):

        url = f"{BASE_URL}/route/directions/json"

        params = {
            "api-version": "1.0",
            "subscription-key": AZURE_MAPS_KEY,
            "query": f"{origin.lat},{origin.lon}:{destination.lat},{destination.lon}",
            "maxAlternatives": alternatives,
            "traffic": "true"
        }

        async with httpx.AsyncClient() as client:
            r = await client.get(url, params=params)

        return r.json()