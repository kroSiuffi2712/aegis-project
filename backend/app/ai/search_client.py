import os
from azure.search.documents import SearchClient
from azure.core.credentials import AzureKeyCredential
from app.core.config import get_settings

settings = get_settings()

AZURE_SEARCH_ENDPOINT = settings.AZURE_SEARCH_ENDPOINT
AZURE_SEARCH_INDEX = settings.AZURE_SEARCH_INDEX
AZURE_SEARCH_KEY = settings.AZURE_SEARCH_KEY


def get_search_client():

    endpoint = AZURE_SEARCH_ENDPOINT
    index_name = AZURE_SEARCH_INDEX
    key = AZURE_SEARCH_KEY

    client = SearchClient(
        endpoint=endpoint,
        index_name=index_name,
        credential=AzureKeyCredential(key)
    )

    return client