import json
from app.ai.kernel import create_kernel


class ResponseStrategyAgent:

    def __init__(self):
        self.kernel = create_kernel()

    async def plan_response(self, incident, triage_result, available_resources):

        prompt = f"""
You are an Emergency Medical Response Strategy AI.

Your task is to determine the optimal operational response strategy
for an emergency incident based on the medical triage assessment,
the number of victims involved, and the available emergency resources.

------------------------
INCIDENT
------------------------
{json.dumps(incident, indent=2, default=str)}

NOTE:
The incident may include a field called "victim_count" representing
the number of patients or victims involved in the emergency.

------------------------
TRIAGE RESULT
------------------------
{json.dumps(triage_result, indent=2, default=str)}

------------------------
AVAILABLE RESOURCES
------------------------
{json.dumps(available_resources, indent=2, default=str)}

------------------------
RESPONSE STRATEGY RULES
------------------------

Criticality Level 1:
Immediate life-threatening emergency.
Dispatch highest priority response immediately.

Criticality Level 2:
Serious emergency.
Dispatch high priority ambulance.

Criticality Level 3:
Urgent but stable.
Standard ambulance dispatch.

Criticality Level 4:
Non urgent condition.
Low priority dispatch.

MULTI-VICTIM RULE:

If victim_count > 1 consider recommending multiple ambulance units.

Examples:
- 1 victim → normally 1 ambulance
- 2–3 victims → consider 2 ambulances
- 4+ victims → consider multiple units or specialized response

Never recommend more units than necessary.

Also consider available resources when recommending units.

------------------------
TASK
------------------------

Determine:

1. Response priority
2. Dispatch mode
3. Number of ambulances recommended
4. Special medical unit requirements

------------------------
OUTPUT FORMAT
------------------------

Return STRICT JSON:

{{
  "response_priority": "",
  "dispatch_mode": "",
  "recommended_units": 0,
  "special_requirements": [],
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
            raise ValueError(f"Invalid JSON returned by strategy agent: {raw_output}")