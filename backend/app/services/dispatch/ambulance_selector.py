from app.services.dispatch.azure_maps_client import AzureMapsClient

maps_client = AzureMapsClient()


async def select_ambulances(patient_location, ambulances):

    # soportar GeoJSON
    if "coordinates" in patient_location:
        patient_lon = patient_location["coordinates"][0]
        patient_lat = patient_location["coordinates"][1]

    # soportar dict lat/lon
    elif "lon" in patient_location:
        patient_lon = patient_location["lon"]
        patient_lat = patient_location["lat"]

    else:
        patient_lon = patient_location.lon
        patient_lat = patient_location.lat

    available = [a for a in ambulances if a["status"].lower() == "available"]

    if not available:
        return []

    origins = [[a["lon"], a["lat"]] for a in available]

    destination = [[patient_lon, patient_lat]]

    routes = await maps_client.distance_matrix(origins, destination)

    ranked = []

    for route in routes:

        idx = route["index"]
        amb = available[idx]

        ranked.append({
            "ambulance": amb,
            "eta": route["travel_time_seconds"],
            "distance": route["distance_meters"]
        })

    ranked.sort(key=lambda x: x["eta"])

    return ranked[:3]