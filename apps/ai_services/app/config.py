import os
import logging
from typing import List
from dotenv import load_dotenv

# Load environment configuration from .env file
load_dotenv()

class Settings:
    """Application runtime settings and environment bindings."""
    APP_TITLE: str = "ThinkWires AI Microservice"
    APP_DESCRIPTION: str = "Resume Parsing, ATS Fit Scoring, and AI Screening Assessment Gatekeeper"
    APP_VERSION: str = "1.0.0"
    
    # Server network bindings
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", 8000))
    DEBUG: bool = os.getenv("DEBUG", "false").lower() in ("true", "1", "yes")

    # CORS Allowed Origins
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://localhost:5000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5000",
        "*",
    ]

    # OpenAI LLM integration
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "").strip()
    OPENAI_MODEL: str = os.getenv("OPENAI_MODEL", "gpt-4o-mini")

    @property
    def is_openai_configured(self) -> bool:
        return bool(self.OPENAI_API_KEY and self.OPENAI_API_KEY != "your_openai_key_here")

settings = Settings()

# Setup logging
logging.basicConfig(
    level=logging.DEBUG if settings.DEBUG else logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger("thinkwires.ai_services")
