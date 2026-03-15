import json
from app.ai.kernel import create_kernel
from fastapi.encoders import jsonable_encoder


class TransportRiskAgent:

    def __init__(self):
        self.kernel = create_kernel()

    async def evaluate_transport_risk(
        self,
        incident,
        triage_result,
        route_metrics,
        traffic_data,
        weather_data
    ):

        incident_clean = jsonable_encoder(incident)
        triage_clean = jsonable_encoder(triage_result)
        route_clean = jsonable_encoder(route_metrics)
        traffic_clean = jsonable_encoder(traffic_data)
        weather_clean = jsonable_encoder(weather_data)

        prompt = f"""
You are an Emergency Medical Transport Risk AI.

Your task is to evaluate the risk involved in transporting a patient from the incident location to the selected clinic.

You must analyze the medical severity of the patient together with route conditions such as distance, traffic, travel time and weather.

------------------------
INCIDENT
------------------------
{json.dumps(incident_clean, indent=2)}

------------------------
TRIAGE RESULT
------------------------
{json.dumps(triage_clean, indent=2)}

------------------------
ROUTE METRICS
------------------------
{json.dumps(route_clean, indent=2)}

------------------------
TRAFFIC CONDITIONS
------------------------
{json.dumps(traffic_clean, indent=2)}

------------------------
WEATHER CONDITIONS
------------------------
{json.dumps(weather_clean, indent=2)}

------------------------
TASK
------------------------

1. Evaluate how safe the patient transport is.
2. Identify the main transport risk factors.
3. Classify the overall transport risk.

------------------------
TRANSPORT RISK SCALE
------------------------

LOW
Moderate transport time, stable patient, low traffic.

MEDIUM
Some delays or moderate patient condition.

HIGH
Long transport time, severe patient condition, heavy traffic or dangerous weather.

------------------------
OUTPUT RULES
------------------------

Return STRICT JSON.

Do NOT add fields.
Do NOT change field names.
Do NOT include explanations outside JSON.

------------------------
OUTPUT FORMAT
------------------------

{{
 "transport_risk_level": "",
 "risk_factors": [],
 "recommendations": [],
 "confidence": 0.0
}}
"""

        result = await self.kernel.invoke_prompt(prompt)

        raw_output = str(result).strip()

        if raw_output.startswith("```"):
            raw_output = raw_output.replace("```json", "").replace("```", "").strip()

        try:
            return json.loads(raw_output)

        except json.JSONDecodeError:
            raise ValueError(f"Invalid JSON returned by transport risk agent: {raw_output}")