# app/main.py

from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.endpoints import (
    health,
    incidents,
    zones,
    supervisors,
    insurance,
    clinics,
    ambulances,
    decision,
    provider,
    patients,
    dispatch
)

from app.core.database import connect_to_mongo, close_mongo_connection
from app.core.database_initializer import DatabaseInitializer
from app.core.config import get_settings

from app.core.logger import setup_logging
from app.core.error_handler import GlobalExceptionMiddleware


settings = get_settings()

setup_logging()


# -----------------------------
# Application lifecycle
# -----------------------------

@asynccontextmanager
async def lifespan(app: FastAPI):

    print("Starting Aegis backend...")

    # Connect to MongoDB
    connect_to_mongo()

    # Initialize database (indexes + seeds)
    await DatabaseInitializer.initialize()

    print(f"Running environment: {settings.ENVIRONMENT}")
    print(f"Database name: {settings.DATABASE_NAME}")

    print("Startup completed")

    yield

    # Shutdown
    close_mongo_connection()
    print("MongoDB connection closed")


app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    lifespan=lifespan
)


# -----------------------------
# CORS configuration
# -----------------------------
origins = settings.CORS_ORIGINS.split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------------
# Global error handler
# -----------------------------

app.add_middleware(GlobalExceptionMiddleware)


# -----------------------------
# Routers
# -----------------------------

app.include_router(health.router, prefix="/api/v1", tags=["Health"])
app.include_router(incidents.router, prefix="/api/v1", tags=["Incidents"])
app.include_router(zones.router, prefix="/api/v1", tags=["Zones"])
app.include_router(supervisors.router, prefix="/api/v1", tags=["Supervisors"])
app.include_router(clinics.router, prefix="/api/v1", tags=["Clinics"])
app.include_router(insurance.router, prefix="/api/v1", tags=["Insurance"])
app.include_router(ambulances.router, prefix="/api/v1", tags=["Ambulances"])
app.include_router(decision.router, prefix="/api/v1", tags=["Decisions"])
app.include_router(provider.router, prefix="/api/v1", tags=["Providers"])
app.include_router(patients.router, prefix="/api/v1", tags=["Patients"])
app.include_router(dispatch.router, prefix="/api/v1", tags=["Dispatch"])