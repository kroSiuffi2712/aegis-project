from pydantic import BaseModel
from datetime import datetime


class PatientCreate(BaseModel):
    first_name: str
    last_name: str
    dni: str
    phone: str
    address: str
    insurance_id: str


class PatientResponse(BaseModel):
    id: str
    first_name: str
    last_name: str
    dni: str
    phone: str
    address: str
    insurance_id: str
    created_at: datetime