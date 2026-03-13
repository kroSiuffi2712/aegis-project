from fastapi import Request
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
from app.core.logger import get_logger

logger = get_logger("global_error_handler")

class GlobalExceptionMiddleware(BaseHTTPMiddleware):

    async def dispatch(self, request: Request, call_next):

        try:
            response = await call_next(request)
            return response

        except ValueError as ve:
            logger.warning(f"ValueError: {str(ve)} | Path: {request.url.path}")
            return JSONResponse(
                status_code=400,
                content={
                    "success": False,
                    "error": str(ve)
                }
            )

        except Exception as e:
            logger.error(
                f"Unhandled error: {str(e)} | Path: {request.url.path}",
                exc_info=True
            )
            return JSONResponse(
                status_code=500,
                content={
                    "success": False,
                    "error": "Internal Server Error"
                }
            )