from pydantic import BaseModel
from datetime import datetime

class SupervisorCreate(BaseModel):
    zone_id: str

class SupervisorResponse(BaseModel):
    id: str
    zone_id: str
    active: bool
    incident_count: int
    created_at: datetime