from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class PatientCreate(BaseModel):
    first_name: str
    last_name: str
    dni: str
    phone: str
    address: str
    insurance_id: str
    family_group_id: Optional[str] = None
    family_role: Optional[str] = None


class PatientResponse(BaseModel):
    id: str
    first_name: str
    last_name: str
    dni: str
    phone: str
    address: str
    insurance_id: str
    family_group_id: Optional[str] = None
    family_role: Optional[str] = None
    created_at: datetime