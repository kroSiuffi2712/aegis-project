def evaluate_routes(routes):

    for route in routes:

        route["score"] = route["travel_time_seconds"]

    routes.sort(key=lambda x: x["score"])

    return routes[0]