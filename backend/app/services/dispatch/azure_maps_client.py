import httpx
import asyncio
import logging
import json

from app.core.config import get_settings

settings = get_settings()

logger = logging.getLogger(__name__)


class AzureMapsClient:

    def __init__(self):
        self.base_url = settings.AZURE_MAPS_URL
        self.subscription_key = settings.AZURE_MAPS_KEY

    async def distance_matrix(self, origins, destination):

        url = f"{self.base_url}/route/matrix/json"

        body = {
            "origins": {
                "type": "MultiPoint",
                "coordinates": origins
            },
            "destinations": {
                "type": "MultiPoint",
                "coordinates": destination
            }
        }

        logger.info("AZURE MATRIX BODY -> %s", json.dumps(body))

        params = {
            "api-version": "1.0",
            "subscription-key": self.subscription_key
        }

        async with httpx.AsyncClient(timeout=30) as client:

            response = await client.post(url, params=params, json=body)

            if response.status_code not in [200, 202]:
                raise Exception(f"Azure Maps error {response.text}")

            # si Azure responde inmediatamente
            if response.status_code == 200:
                data = response.json()
                return self._parse_matrix(data)

            # async operation
            operation_url = response.headers.get("location")

            if not operation_url:
                raise Exception("Azure Maps did not return location header")

            for _ in range(15):

                await asyncio.sleep(1)

                result = await client.get(
                    f"{operation_url}&subscription-key={self.subscription_key}"
                )

                data = result.json()

                if data.get("matrix"):
                    return self._parse_matrix(data)

            raise TimeoutError("Azure matrix timeout")

    def _parse_matrix(self, data):

        routes = []

        matrix = data["matrix"]

        for i, row in enumerate(matrix):

            cell = row[0]

            if cell["statusCode"] != 200:
                continue

            summary = cell["response"]["routeSummary"]

            routes.append({
                "index": i,
                "distance_meters": summary["lengthInMeters"],
                "travel_time_seconds": summary["travelTimeInSeconds"]
            })

        return routes

    async def get_current_weather(self, lat: float, lon: float):

        url = f"{self.base_url}/weather/currentConditions/json"

        params = {
            "api-version": "1.0",
            "query": f"{lat},{lon}",
            "subscription-key": self.subscription_key
        }

        async with httpx.AsyncClient(timeout=10) as client:

            response = await client.get(url, params=params)

            if response.status_code != 200:
                raise Exception(f"Azure Weather API error: {response.text}")

            data = response.json()

            results = data.get("results", [])

            if not results:
                return None

            weather = results[0]

            return {
                "temperature": weather.get("temperature", {}).get("value"),
                "condition": weather.get("phrase"),
                "precipitation_probability": weather.get("precipitationProbability", 0),
                "visibility_km": weather.get("visibility", {}).get("value"),
                "wind_kmh": weather.get("wind", {}).get("speed", {}).get("value")
            }
    async def get_traffic_flow(self, lat: float, lon: float):

        url = f"{self.base_url}/traffic/flow/segment/json"

        params = {
            "api-version": "1.0",
            "query": f"{lat},{lon}",
            "zoom": 12,
            "style": "absolute",
            "subscription-key": self.subscription_key
        }

        async with httpx.AsyncClient(timeout=10) as client:

            response = await client.get(url, params=params)

            if response.status_code != 200:
                raise Exception(f"Azure Traffic API error: {response.text}")

            data = response.json()

            flow = data.get("flowSegmentData")

            if not flow:
                return None

            return {
                "current_speed": flow.get("currentSpeed"),
                "free_flow_speed": flow.get("freeFlowSpeed"),
                "current_travel_time": flow.get("currentTravelTime"),
                "free_flow_travel_time": flow.get("freeFlowTravelTime"),
                "confidence": flow.get("confidence")
            }

    async def get_route_directions(self, origin_lat: float, origin_lon: float, dest_lat: float, dest_lon: float):

        url = f"{self.base_url}/route/directions/json"

        params = {
            "api-version": "1.0",
            "query": f"{origin_lat},{origin_lon}:{dest_lat},{dest_lon}",
            "subscription-key": self.subscription_key
        }

        async with httpx.AsyncClient(timeout=20) as client:

            response = await client.get(url, params=params)

            if response.status_code != 200:
                raise Exception(f"Azure Routing API error: {response.text}")

            data = response.json()

            routes = data.get("routes", [])

            if not routes:
                return None

            summary = routes[0]["summary"]

            return {
                "distance_meters": summary.get("lengthInMeters"),
                "travel_time_seconds": summary.get("travelTimeInSeconds"),
                "traffic_delay_seconds": summary.get("trafficDelayInSeconds", 0)
            }