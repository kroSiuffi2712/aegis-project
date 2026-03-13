from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List


class InsuranceCreate(BaseModel):
    nit: str
    name: str
    clinic_ids: Optional[List[str]] = []


class InsuranceResponse(BaseModel):
    id: str
    nit: str
    name: str
    clinic_ids: List[str]
    active: bool
    created_at: datetime