from fastapi import APIRouter
from typing import List

from app.services.provider_service import ProviderService
from app.schemas.provider_schema import ProviderCreate, ProviderResponse

router = APIRouter()
service = ProviderService()


@router.get("/providers", response_model=List[ProviderResponse])
async def get_providers():
    return await service.get_providers()


@router.post("/providers", response_model=ProviderResponse)
async def create_provider(provider: ProviderCreate):
    return await service.create_provider(provider)