import asyncio

from app.agents.transport_risk_agent import TransportRiskAgent


async def test_transport_risk():

    agent = TransportRiskAgent()

    incident = {
        "severity": "HIGH"
    }

    triage_result = {
        "priority": "HIGH"
    }

    route_metrics = {
        "distance_meters": 5000,
        "travel_time_seconds": 900
    }

    traffic_data = {
        "traffic_percent": 40
    }

    weather_data = {
        "weather_percent": 20
    }

    result = await agent.evaluate_transport_risk(
        incident=incident,
        triage_result=triage_result,
        route_metrics=route_metrics,
        traffic_data=traffic_data,
        weather_data=weather_data
    )

    print("\n===== TRANSPORT RISK RESULT =====")
    print(result)
    print("=================================\n")


if __name__ == "__main__":
    asyncio.run(test_transport_risk())