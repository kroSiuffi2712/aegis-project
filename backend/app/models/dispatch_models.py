from pydantic import BaseModel
from typing import List, Optional


class Location(BaseModel):
    lat: float
    lon: float


class Ambulance(BaseModel):
    id: str
    location: Location
    status: str


class Clinic(BaseModel):
    id: str
    name: str
    location: Location


class RouteOption(BaseModel):
    route_id: str
    distance_meters: float
    travel_time_seconds: int
    traffic_level: Optional[str] = None
    weather_impact: Optional[str] = None
    score: Optional[float] = None


class DispatchDecision(BaseModel):
    ambulance_id: str
    clinic_id: str
    route: RouteOption
    eta_to_patient: int
    eta_to_clinic: int