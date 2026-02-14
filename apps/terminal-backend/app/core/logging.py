import logging

from app.core.config import Settings


def configure_logging(settings: Settings) -> None:
    logging.basicConfig(
        level=logging.INFO,
        format=f"%(asctime)s %(levelname)s [%(name)s] env={settings.app_env} %(message)s",
    )
