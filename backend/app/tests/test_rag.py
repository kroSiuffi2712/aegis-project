import asyncio
from app.ai.rag_service import RAGService
from dotenv import load_dotenv

load_dotenv()


async def main():

    rag = RAGService()

    result = await rag.search("patient not breathing")

    print("\n===== CONTEXT =====\n")
    print(result)


asyncio.run(main())