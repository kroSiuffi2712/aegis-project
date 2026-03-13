from typing import List
from .models.dispatch_models import Ambulance, Location
from .routing.azure_maps_client import AzureMapsClient


maps_client = AzureMapsClient()


async def select_ambulances(
    patient_location: Location,
    ambulances: List[Ambulance]
):

    available = [a for a in ambulances if a.status == "AVAILABLE"]

    if not available:
        return []

    origins = [a.location for a in available]
    destinations = [patient_location]

    matrix = await maps_client.distance_matrix(origins, destinations)

    results = []

    for idx, a in enumerate(available):

        travel_time = matrix["matrix"][idx][0]["response"]["routeSummary"]["travelTimeInSeconds"]

        results.append({
            "ambulance": a,
            "eta": travel_time
        })

    ranked = sorted(results, key=lambda x: x["eta"])

    return ranked[:3]