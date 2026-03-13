from pydantic import BaseModel, Field
from typing import Optional


class ProviderBase(BaseModel):
    name: str
    nit: str
    phone: str
    address: str


class ProviderCreate(ProviderBase):
    id: str


class ProviderResponse(ProviderBase):
    id: str

    class Config:
        from_attributes = True