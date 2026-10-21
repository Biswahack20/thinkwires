from fastapi import APIRouter
from app.api.v1.health import router as health_router
from app.api.v1.resume import router as resume_router
from app.api.v1.screening import router as screening_router

api_router = APIRouter()

# Mount sub-routers
api_router.include_router(health_router)
api_router.include_router(resume_router)
api_router.include_router(screening_router)
