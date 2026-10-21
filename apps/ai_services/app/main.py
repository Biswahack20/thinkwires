from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings, logger
from app.api.router import api_router

def create_app() -> FastAPI:
    """FastAPI application factory."""
    application = FastAPI(
        title=settings.APP_TITLE,
        description=settings.APP_DESCRIPTION,
        version=settings.APP_VERSION,
        docs_url="/docs",
        redoc_url="/redoc",
        openapi_url="/openapi.json",
    )

    # Configure CORS middleware
    application.add_middleware(
        CORSMiddleware,
        allow_origins=settings.CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Register central router
    application.include_router(api_router)

    logger.info(f"Initialized {settings.APP_TITLE} v{settings.APP_VERSION}")
    return application

app = create_app()
