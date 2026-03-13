import base64
import os
from app.ai.search_client import get_search_client


class RAGService:

    def __init__(self):
        self.client = get_search_client()

    async def search(self, query: str):

        results = self.client.search(
            search_text=query,
            top=3
        )

        docs = []

        for r in results:

            source = "unknown"

            if "metadata_storage_path" in r:

                encoded_path = r["metadata_storage_path"]

                # Fix padding
                encoded_path += "=" * (-len(encoded_path) % 4)

                decoded = base64.b64decode(encoded_path).decode("utf-8")

                source = os.path.basename(decoded)

            docs.append(f"""
    Source: {source}

    Content:
    {r["content"]}
    """)

        return "\n\n".join(docs)