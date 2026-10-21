from app.api.v1.health import router as health_router
from app.api.v1.resume import router as resume_router
from app.api.v1.screening import router as screening_router

__all__ = [
    "health_router",
    "resume_router",
    "screening_router",
]
