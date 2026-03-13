import semantic_kernel as sk
from semantic_kernel.connectors.ai.open_ai import OpenAIChatCompletion
from app.core.config import get_settings


def create_kernel():

    settings = get_settings()

    kernel = sk.Kernel()

    kernel.add_service(
        OpenAIChatCompletion(
            service_id="chat",
            ai_model_id=settings.OPENAI_MODEL,
            api_key=settings.OPENAI_API_KEY
        )
    )

    return kernel