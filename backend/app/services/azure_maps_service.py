import random

from app.services.dispatch.azure_maps_client import AzureMapsClient


class AzureMapsService:

    def __init__(self):
        self.client = AzureMapsClient()

    async def get_route(self, origin_lat, origin_lng, dest_lat, dest_lng):

        origins = [
            [origin_lng, origin_lat]
        ]

        destination = [
            [dest_lng, dest_lat]
        ]

        routes = await self.client.distance_matrix(
            origins,
            destination
        )

        if not routes:
            raise Exception("No route returned from Azure Maps")

        route = routes[0]

        distance_km = round(route["distance_meters"] / 1000, 2)
        eta_minutes = int(route["travel_time_seconds"] / 60)

        return {
            "distance_km": distance_km,
            "eta_minutes": eta_minutes,
            "origin": {
                "lat": origin_lat,
                "lng": origin_lng
            },
            "destination": {
                "lat": dest_lat,
                "lng": dest_lng
            }
        }

    async def get_route_intelligence(
        self,
        distance_meters: int,
        travel_time_seconds: int,
        traffic_delay_seconds: int
    ):

        distance_km = round(distance_meters / 1000, 1)

        baseline_eta = (
            travel_time_seconds - traffic_delay_seconds
        ) / 60

        adjusted_eta = travel_time_seconds / 60

        traffic_severity = (
            traffic_delay_seconds / travel_time_seconds
        )

        weather_impact = random.uniform(0.1, 0.6)

        baseline_score = 70

        adjusted_score = int(
            baseline_score
            - (traffic_severity * 20)
            - (weather_impact * 10)
        )

        adjusted_score = max(adjusted_score, 0)

        impact_delta = baseline_score - adjusted_score

        timeline = [
            {
                "minute": 0,
                "baseline": baseline_score,
                "adjusted": baseline_score
            },
            {
                "minute": 3,
                "baseline": int(baseline_score * 1.15),
                "adjusted": baseline_score - int(impact_delta * 0.5)
            },
            {
                "minute": 6,
                "baseline": int(baseline_score * 1.30),
                "adjusted": adjusted_score
            }
        ]

        return {
            "eta_intelligence": {
                "baseline_eta_minutes": round(baseline_eta),
                "ai_adjusted_eta_minutes": round(adjusted_eta),
                "distance_km": distance_km,
            },
            "external_impact": {
                "traffic_severity_percent": int(traffic_severity * 100),
                "weather_impact_percent": int(weather_impact * 100),
            },
            "transport_projection": {
                "baseline_score": baseline_score,
                "adjusted_score": adjusted_score,
                "timeline": timeline
            }
        }
    
    async def get_weather(self, lat: float, lng: float):

        weather = await self.client.get_current_weather(lat, lng)

        if not weather:
            raise Exception("No weather data returned from Azure Maps")

        return {
            "location": {
                "lat": lat,
                "lng": lng
            },
            "temperature": weather.get("temperature"),
            "condition": weather.get("condition"),
            "precipitation_probability": weather.get("precipitation_probability"),
            "visibility_km": weather.get("visibility_km"),
            "wind_kmh": weather.get("wind_kmh")
        }

    async def get_traffic(self, lat: float, lng: float):

        traffic = await self.client.get_traffic_flow(lat, lng)

        if not traffic:
            raise Exception("No traffic data returned from Azure Maps")

        return {
            "location": {
                "lat": lat,
                "lng": lng
            },
            "current_speed": traffic.get("current_speed"),
            "free_flow_speed": traffic.get("free_flow_speed"),
            "current_travel_time": traffic.get("current_travel_time"),
            "free_flow_travel_time": traffic.get("free_flow_travel_time"),
            "confidence": traffic.get("confidence")
        }
    
    async def get_route_directions(
        self,
        origin_lat: float,
        origin_lng: float,
        dest_lat: float,
        dest_lng: float
    ):

        route = await self.client.get_route_directions(
            origin_lat,
            origin_lng,
            dest_lat,
            dest_lng
        )

        if not route:
            raise Exception("No route returned from Azure Maps")

        distance_km = round(route["distance_meters"] / 1000, 2)
        eta_minutes = int(route["travel_time_seconds"] / 60)
        traffic_delay_minutes = int(route["traffic_delay_seconds"] / 60)

        return {
            "origin": {
                "lat": origin_lat,
                "lng": origin_lng
            },
            "destination": {
                "lat": dest_lat,
                "lng": dest_lng
            },
            "distance_km": distance_km,
            "eta_minutes": eta_minutes,
            "traffic_delay_minutes": traffic_delay_minutes
        }

    async def get_route_environment_intelligence(
        self,
        origin_lat: float,
        origin_lng: float,
        dest_lat: float,
        dest_lng: float
    ):

        # Get external data
        route = await self.get_route_directions(
            origin_lat,
            origin_lng,
            dest_lat,
            dest_lng
        )

        traffic = await self.get_traffic(
            origin_lat,
            origin_lng
        )

        weather = await self.get_weather(
            dest_lat,
            dest_lng
        )

        # Calculate traffic severity
        traffic_severity = 0

        if traffic["free_flow_speed"]:
            traffic_severity = 1 - (
                traffic["current_speed"] /
                traffic["free_flow_speed"]
            )

        traffic_severity = max(0, min(traffic_severity, 1))

        traffic_risk = int(traffic_severity * 40)

        # Calculate weather risk
        precipitation = weather.get("precipitation_probability", 0)

        if precipitation > 70:
            weather_risk = 30
        elif precipitation > 40:
            weather_risk = 20
        elif precipitation > 20:
            weather_risk = 10
        else:
            weather_risk = 5

        # Distance risk
        distance_km = route["distance_km"]

        if distance_km > 20:
            distance_risk = 20
        elif distance_km > 10:
            distance_risk = 15
        elif distance_km > 5:
            distance_risk = 10
        else:
            distance_risk = 5

        # Score
        risk_score = min(
            100,
            traffic_risk + weather_risk + distance_risk
        )

        return {

            "route": route,

            "environment": {
                "traffic": traffic,
                "weather": weather
            },

            "risk_components": {
                "traffic_risk": traffic_risk,
                "weather_risk": weather_risk,
                "distance_risk": distance_risk
            },

            "risk_score": risk_score
        }