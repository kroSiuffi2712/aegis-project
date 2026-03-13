from pydantic import BaseModel
from datetime import datetime
from typing import List


class Location(BaseModel):
    lat: float
    lng: float


class ClinicCreate(BaseModel):
    nit: str
    name: str
    location: Location


class ClinicResponse(BaseModel):
    id: str
    nit: str
    name: str
    location: Location
    active: bool
    created_at: datetime