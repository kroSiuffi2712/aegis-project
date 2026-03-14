import json
from app.ai.kernel import create_kernel
from fastapi.encoders import jsonable_encoder
from app.schemas.dispatch_decision_schema import DispatchDecision


class DispatchAgent:

    def __init__(self):
        self.kernel = create_kernel()

    async def select_resources(
        self,
        incident,
        triage_result,
        candidate_ambulances,
        candidate_clinics
    ):

        incident_clean = jsonable_encoder(incident)
        triage_clean = jsonable_encoder(triage_result)
        ambulances_clean = jsonable_encoder(candidate_ambulances)
        clinics_clean = jsonable_encoder(candidate_clinics)

        prompt = f"""
You are an Emergency Medical Dispatch AI.

Your task is to assign the best ambulance and clinic for an incident.

------------------------
INCIDENT
------------------------
{json.dumps(incident_clean, indent=2)}

------------------------
TRIAGE RESULT
------------------------
{json.dumps(triage_clean, indent=2)}

------------------------
AVAILABLE AMBULANCES
------------------------
{json.dumps(ambulances_clean, indent=2)}

------------------------
AVAILABLE CLINICS
------------------------
These clinics are already filtered by the patient's insurance network.

{json.dumps(clinics_clean, indent=2)}

------------------------
DISPATCH RULES
------------------------

1. Ambulance must have status AVAILABLE.
2. Prefer the closest ambulance to the incident.
3. Clinics MUST belong to the patient's insurance network.
4. Prefer clinics closest to the incident location.
5. Criticality level 1 must prioritize the fastest response.
6. If an ambulance is already associated with a clinic, prefer sending the patient there.

------------------------
TASK
------------------------

Select the best ambulance and clinic.

IMPORTANT:
- selected_ambulance_index MUST be the index of the ambulance in AVAILABLE AMBULANCES.
- selected_clinic_index MUST be the index of the clinic in AVAILABLE CLINICS.

Indexes start at 0.

------------------------
STRICT RULES
------------------------

Return STRICT JSON.

Do NOT add fields.
Do NOT change field names.
Do NOT include explanations outside JSON.
IDs must be returned as STRING values.

------------------------
CRITICAL RULE:
------------------------

selected_ambulance_id MUST be one of VALID AMBULANCE IDS.
selected_clinic_id MUST be one of VALID CLINIC IDS.

If you select an ID that is not in these lists the answer is INVALID.

------------------------
OUTPUT FORMAT
------------------------

{{
  "selected_ambulance_index": 0,
  "selected_clinic_index": 0,
  "reasoning": "",
  "confidence": 0.0
}}
"""

        result = await self.kernel.invoke_prompt(prompt)

        raw_output = str(result).strip()

        if raw_output.startswith("```"):
            raw_output = raw_output.replace("```json", "").replace("```", "").strip()

        try:

            data = json.loads(raw_output)

            validated = DispatchDecision(**data)

            validated.selected_ambulance_index = int(validated.selected_ambulance_index)
            validated.selected_clinic_index = int(validated.selected_clinic_index)

            return validated.model_dump()

        except json.JSONDecodeError:
            raise ValueError(f"Invalid JSON returned by dispatch agent: {raw_output}")

        except Exception as e:
            raise ValueError(f"Dispatch output validation failed: {str(e)}")