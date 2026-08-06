from functools import lru_cache
from pydantic import Field 
from pydantic_settings import BaseSettings , SettingsConfigDict

class SETTINGS(BaseSettings):
  model_config = SettingsConfigDict(
    env_file = ".env",
  env_file_encoding = "utf-8",
  extra = "ignore"
  )
  

  APP_NAME: str=Field(default="Plant Disease Detection System")
  APP_VERSION: str=Field(default="1.0.0")
  DEBUG:bool=Field(default=True)

HOST:str=Field(default="127.0.0.1")
PORT:int=Field(Default=8000)

PROJECT_DESCRIPTION: str = Field(
        default="AI Powered Plant Disease Detection System"
    )

API_V1_PREFIX: str = Field(default="/api/v1")


@lru_cache
def get_settings() -> Settings:
    """
    Returns cached settings instance.
    """
    return Settings()


settings = get_settings()
    