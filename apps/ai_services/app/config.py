import os
import logging
from typing import List
from dotenv import load_dotenv

# Load environment configuration (apps/ai_services/.env first, then root .env if present)
_app_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
_local_env = os.path.join(_app_dir, ".env")
_root_env = os.path.join(os.path.dirname(os.path.dirname(_app_dir)), ".env")

if os.path.exists(_local_env):
    load_dotenv(_local_env)
if os.path.exists(_root_env):
    load_dotenv(_root_env)
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
    _DEFAULT_CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://localhost:5000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5000",
    ]

    @property
    def CORS_ORIGINS(self) -> List[str]:
        env_origins = os.getenv("CORS_ORIGINS", "")
        parsed = [
            origin.strip()
            for origin in env_origins.split(",")
            if origin.strip() and origin.strip() != "*"
        ]
        return parsed or self._DEFAULT_CORS_ORIGINS

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
