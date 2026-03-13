from app.repositories.ambulance_repository import AmbulanceRepository
from app.repositories.clinic_repository import ClinicRepository

from app.services.dispatch.ambulance_selector import select_ambulances
from app.services.dispatch.clinic_selector import select_clinics
from app.services.dispatch.azure_maps_client import AzureMapsClient


maps_client = AzureMapsClient()

ambulance_repo = AmbulanceRepository()
clinic_repo = ClinicRepository()


async def dispatch(patient_location, ambulances=None, clinics=None):

    if ambulances is None:
        ambulances = await ambulance_repo.get_available_ambulances()

    if clinics is None:
        clinics = await clinic_repo.get_active_clinics()

    # Convertir Pydantic → dict
    if ambulances and not isinstance(ambulances[0], dict):
        ambulances = [a.model_dump() for a in ambulances]

    if clinics and not isinstance(clinics[0], dict):
        clinics = [c.model_dump() for c in clinics]

    # --------------------------------
    # Normalizar coordenadas ambulancias
    # --------------------------------
    for a in ambulances:

        if "location" in a:

            loc = a["location"]

            # CASO GEOJSON (Mongo)
            if "coordinates" in loc:
                a["lat"] = loc["coordinates"][1]
                a["lon"] = loc["coordinates"][0]

            else:

                if "lat" in loc:
                    a["lat"] = loc["lat"]

                if "lon" in loc:
                    a["lon"] = loc["lon"]
                elif "lng" in loc:
                    a["lon"] = loc["lng"]

    # --------------------------------
    # Normalizar coordenadas clínicas
    # --------------------------------
    for c in clinics:

        if "location" in c:

            loc = c["location"]

            # CASO GEOJSON (Mongo)
            if "coordinates" in loc:
                c["lat"] = loc["coordinates"][1]
                c["lon"] = loc["coordinates"][0]

            else:

                if "lat" in loc:
                    c["lat"] = loc["lat"]

                if "lon" in loc:
                    c["lon"] = loc["lon"]
                elif "lng" in loc:
                    c["lon"] = loc["lng"]

    if not ambulances:
        raise Exception("No available ambulances")

    if not clinics:
        raise Exception("No active clinics")

    # --------------------------------
    # SELECTORES (usan Azure Matrix)
    # --------------------------------
    print("PATIENT:", patient_location)
    print("AMBULANCES FOR DISPATCH:", ambulances)

    ambulance_candidates = await select_ambulances(
        patient_location,
        ambulances
    )

    clinic_candidates = await select_clinics(
        patient_location,
        clinics
    )

    # --------------------------------
    # EVALUACIÓN DE OPCIONES
    # --------------------------------

    all_options = []
    best_option = None
    best_score = float("inf")

    for amb in ambulance_candidates:

        ambulance = amb["ambulance"]
        eta_patient = amb["eta"]
        distance_patient = amb["distance"]

        for clinic_data in clinic_candidates:

            clinic = clinic_data["clinic"]
            eta_clinic = clinic_data["eta"]

            score = eta_patient + eta_clinic

            route = {
                "route_id": "matrix_route",
                "distance_meters": distance_patient,
                "travel_time_seconds": eta_patient
            }

            option = {
                "ambulance_id": ambulance["id"],
                "clinic_id": clinic["id"],
                "eta_to_patient": eta_patient,
                "eta_to_clinic": eta_clinic,
                "score": score,
                "route": route
            }

            all_options.append(option)

            if score < best_score:
                best_score = score
                best_option = option

    if not best_option:
        raise Exception("No dispatch option found")

    # --------------------------------
    # MARCAR MEJOR OPCIÓN
    # --------------------------------

    for option in all_options:

        option["best"] = (
            option["ambulance_id"] == best_option["ambulance_id"]
            and option["clinic_id"] == best_option["clinic_id"]
        )

    # ordenar por mejor score
    all_options.sort(key=lambda x: x["score"])

    # --------------------------------
    # TOMAR SOLO LAS 3 MEJORES RUTAS
    # --------------------------------

    top_routes = all_options[:3]

    # --------------------------------
    # RESPUESTA FINAL
    # --------------------------------

    return {
        "options": top_routes
    }