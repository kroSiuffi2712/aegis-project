from pydantic import BaseModel
from typing import Optional


class Location(BaseModel):
    lat: float
    lon: float


class DispatchRequest(BaseModel):
    patient_location: Location


class RouteOption(BaseModel):
    route_id: str
    distance_meters: float
    travel_time_seconds: int
    score: Optional[float]


class DispatchResponse(BaseModel):
    ambulance_id: str
    clinic_id: str
    route: RouteOption
    eta_to_patient: int
    eta_to_clinic: int

class Location(BaseModel):
    lat: float
    lon: float


class Ambulance(BaseModel):
    id: str
    status: str
    location: Location


class Clinic(BaseModel):
    id: str
    name: str
    location: Location