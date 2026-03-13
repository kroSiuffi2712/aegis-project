from app.services.dispatch.azure_maps_client import AzureMapsClient

maps_client = AzureMapsClient()


async def select_clinics(patient_location, clinics):

    if "coordinates" in patient_location:
        patient_lon = patient_location["coordinates"][0]
        patient_lat = patient_location["coordinates"][1]

    elif "lon" in patient_location:
        patient_lon = patient_location["lon"]
        patient_lat = patient_location["lat"]

    else:
        patient_lon = patient_location.lon
        patient_lat = patient_location.lat

    origins = [[patient_lon, patient_lat]]

    destinations = [[c["lon"], c["lat"]] for c in clinics]

    routes = await maps_client.distance_matrix(origins, destinations)

    ranked = []

    for route in routes:

        idx = route["index"]
        clinic = clinics[idx]

        ranked.append({
            "clinic": clinic,
            "eta": route["travel_time_seconds"]
        })

    ranked.sort(key=lambda x: x["eta"])

    return ranked[:3]