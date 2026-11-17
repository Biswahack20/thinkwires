from fastapi import Security, HTTPException, status
from fastapi.security import APIKeyHeader, HTTPBearer, HTTPAuthorizationCredentials
from typing import Optional

from app.config import settings, logger

api_key_header = APIKeyHeader(name="X-API-Key", auto_error=False)
bearer_auth = HTTPBearer(auto_error=False)

async def verify_service_auth(
    api_key: Optional[str] = Security(api_key_header),
    bearer: Optional[HTTPAuthorizationCredentials] = Security(bearer_auth),
) -> bool:
    """
    Validates backend-to-AI-service authentication (SEC-02).
    Requires matching AI_SERVICE_API_KEY if configured in environment.
    Supports either 'X-API-Key' header or 'Authorization: Bearer <key>'.
    """
    expected_key = settings.AI_SERVICE_API_KEY
    if not expected_key:
        # Development mode without explicit key configured
        return True

    token = api_key or (bearer.credentials if bearer else None)

    if not token or token.strip() != expected_key.strip():
        logger.warning("Rejected unauthorized inter-service request to AI Microservice")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Unauthorized: Invalid or missing AI service credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return True
