from datetime import datetime
from app.core.database import get_database
from app.services.provider_service import ProviderService


class DatabaseInitializer:

    @staticmethod
    async def create_indexes():

        db = get_database()

        print("Ensuring database indexes...")

        # -----------------------------
        # ZONES COLLECTION
        # -----------------------------
        zones = db["zones"]

        await zones.create_index(
            [("geometry", "2dsphere")],
            name="zones_geometry_2dsphere_index"
        )

        await zones.create_index(
            "name",
            name="zones_name_index"
        )

        await zones.create_index(
            "created_at",
            name="zones_created_at_index"
        )

        # -----------------------------
        # PROVIDERS COLLECTION
        # -----------------------------
        providers = db["providers"]

        await providers.create_index(
            "name",
            name="providers_name_index"
        )

        await providers.create_index(
            "nit",
            unique=True,
            name="providers_nit_unique_index"
        )

        # -----------------------------
        # INCIDENTS COLLECTION
        # -----------------------------
        incidents = db["incidents"]

        await incidents.create_index(
            "zone_id",
            name="incidents_zone_index"
        )

        await incidents.create_index(
            "status",
            name="incidents_status_index"
        )

        await incidents.create_index(
            "severity",
            name="incidents_severity_index"
        )

        await incidents.create_index(
            "assigned_supervisor_id",
            name="incidents_supervisor_index"
        )

        await incidents.create_index(
            "patient.insurance_id",
            name="incidents_insurance_index"
        )

        await incidents.create_index(
            "created_at",
            name="incidents_created_at_index"
        )

        await incidents.create_index(
            [("location", "2dsphere")],
            name="incidents_location_geo_index"
        )

        # -----------------------------
        # SUPERVISORS COLLECTION
        # -----------------------------
        supervisors = db["supervisors"]

        await supervisors.create_index(
            [("zone_id", 1), ("active", 1)],
            name="supervisors_zone_active_index"
        )

        await supervisors.create_index(
            "incident_count",
            name="supervisors_incident_count_index"
        )

        await supervisors.create_index(
            "created_at",
            name="supervisors_created_at_index"
        )

        # -----------------------------
        # INSURANCES COLLECTION
        # -----------------------------
        insurances = db["insurances"]

        await insurances.create_index(
            "nit",
            unique=True,
            name="insurances_nit_unique_index"
        )

        await insurances.create_index(
            "clinic_ids",
            name="insurances_clinic_ids_index"
        )

        await insurances.create_index(
            "active",
            name="insurances_active_index"
        )

        # -----------------------------
        # CLINICS  COLLECTION
        # -----------------------------
        clinics = db["clinics"]
        
        await clinics.create_index([("location", "2dsphere")])
        await clinics.create_index("nit", unique=True)

        # -----------------------------
        # PATIENTS  COLLECTION
        # -----------------------------
        patients = db["patients"]

        await patients.create_index("dni", unique=True)
        await patients.create_index("insurance_id")

        # -----------------------------
        # AMBULANCE  COLLECTION
        # -----------------------------
        ambulances = db["ambulances"]

        await ambulances.create_index([("location", "2dsphere")])
        await ambulances.create_index("status")
        await ambulances.create_index("zone_id")
        await ambulances.create_index("clinic_id")
        await ambulances.create_index("plate", unique=True)

        # -----------------------------
        # DECISION TRACE  COLLECTION
        # -----------------------------
        decision_traces = db["decision_traces"]

        await decision_traces.create_index("incident_id")
        await decision_traces.create_index("created_at")


        print("Indexes ensured")

    @staticmethod
    async def seed_data():
        """
        Seed initial system data only once.
        Uses the system_config collection to track initialization state.
        """

        db = get_database()
        config_collection = db["system_config"]

        config = await config_collection.find_one({"_id": "database_config"})

        # If already initialized, skip seeding
        if config and config.get("providers_seeded"):
            print("Database already seeded")

            # Display current database version
            print("Database version:", config.get("db_version"))

            return

        print("Seeding database...")

        provider_service = ProviderService()
        await provider_service.seed_providers()

        # Save initialization metadata
        await config_collection.update_one(
            {"_id": "database_config"},
            {
                "$set": {
                    "db_version": 1,
                    "providers_seeded": True,
                    "initialized_at": datetime.utcnow()
                }
            },
            upsert=True
        )

        print("Database seeded successfully")

    @staticmethod
    async def initialize():
        """
        Main entry point for database initialization.
        Called during application startup.
        """

        print("Initializing database...")

        await DatabaseInitializer.create_indexes()
        await DatabaseInitializer.seed_data()

        print("Database initialization complete")