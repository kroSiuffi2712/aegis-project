from pydantic import BaseModel, Field
from datetime import datetime
from typing import List


class Coordinate(BaseModel):
    lat: float
    lng: float


class ZoneCreate(BaseModel):
    name: str
    incident_limit: int
    coordinates: List[Coordinate] = Field(..., min_items=3)


class ZoneResponse(BaseModel):
    id: str
    name: str
    incident_limit: int
    active_incidents: int
    supervisor_agents: List[str]
    coordinates: List[Coordinate]
    created_at: datetime