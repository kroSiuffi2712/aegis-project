from pydantic import BaseModel, Field
from typing import Optional, List, Literal
from datetime import datetime


# GeoJSON Point
class GeoPoint(BaseModel):
    type: Literal["Point"] = "Point"
    coordinates: List[float] 



class CompanyInfo(BaseModel):
    nit: str
    name: str
    description: Optional[str] = None



class AmbulanceCreate(BaseModel):
    plate: str
    driver_name: str
    status: str = "available"  # available | en_route | busy
    location: GeoPoint
    company: CompanyInfo


# Update
class AmbulanceUpdate(BaseModel):
    plate: Optional[str] = None
    driver_name: Optional[str] = None
    status: Optional[str] = None
    location: Optional[GeoPoint] = None
    company: Optional[CompanyInfo] = None


# Response
class AmbulanceResponse(BaseModel):
    id: str
    plate: str
    driver_name: str
    status: str
    location: GeoPoint
    company: CompanyInfo
    created_at: datetime
    updated_at: Optional[datetime] = None

# Pagination model
class Pagination(BaseModel):
    page: int
    page_size: int
    total: int


# List Response
class AmbulanceListResponse(BaseModel):
    success: bool
    data: List[AmbulanceResponse]
    pagination: Pagination