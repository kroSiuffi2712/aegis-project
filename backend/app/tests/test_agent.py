import asyncio
from app.ai.rag_service import RAGService
from app.agents.emergency_triage_agent import TriageAgent


async def main():

    rag = RAGService()
    agent = TriageAgent(rag)

    description = "A man collapsed and is not breathing"

    result = await agent.analyze(description)

    print("\n===== INCIDENT DESCRIPTION =====\n")
    print(description)

    print("\n===== AGENT RESULT =====\n")
    print(result)


if __name__ == "__main__":
    asyncio.run(main())