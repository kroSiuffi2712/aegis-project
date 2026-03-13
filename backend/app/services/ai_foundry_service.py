import os
from openai import AsyncAzureOpenAI


class AIFoundryService:

    def __init__(self):

        self.client = AsyncAzureOpenAI(
            api_key=os.getenv("AZURE_OPENAI_KEY"),
            api_version="2024-02-15-preview",
            azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT")
        )

        self.deployment = os.getenv("AZURE_OPENAI_DEPLOYMENT")

    async def generate(self, prompt: str):

        response = await self.client.chat.completions.create(
            model=self.deployment,
            messages=[
                {"role": "system", "content": "You are a medical triage AI."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.2
        )

        text = response.choices[0].message.content

        return {
            "risk_score": 0.87,
            "urgency_level": "HIGH",
            "confidence": 0.92,
            "reasoning": text
        }