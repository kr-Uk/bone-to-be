import os
from dotenv import load_dotenv

env_file = os.getenv("ENV_FILE", ".env")
load_dotenv(env_file)
print(f"🔧 Loading config from: {env_file}")

class Config:
    RABBITMQ_HOST = os.getenv("RABBITMQ_HOST")
    RABBITMQ_PORT = int(os.getenv("RABBITMQ_PORT", 5672))
    RABBITMQ_USERNAME = os.getenv("RABBITMQ_USERNAME")
    RABBITMQ_PASSWORD = os.getenv("RABBITMQ_PASSWORD")
    RABBITMQ_VHOST = os.getenv("RABBITMQ_VHOST", "/")
    
    # Queue names
    REQUEST_QUEUE = os.getenv("TRYON_REQUEST_QUEUE", os.getenv("REQUEST_QUEUE", "tryon.request.queue"))
    COMPLETED_QUEUE = os.getenv("TRYON_COMPLETED_QUEUE", os.getenv("COMPLETED_QUEUE", "tryon.completed.queue"))
    FAILED_QUEUE = os.getenv("TRYON_FAILED_QUEUE", os.getenv("FAILED_QUEUE", "tryon.failed.queue"))
    
    # Exchange and routing keys
    EXCHANGE = os.getenv("TRYON_EXCHANGE", os.getenv("EXCHANGE", "tryon.exchange"))
    REQUEST_ROUTING_KEY = os.getenv("TRYON_REQUEST_ROUTING_KEY", os.getenv("REQUEST_ROUTING_KEY", "tryon.requested"))
    COMPLETED_ROUTING_KEY = os.getenv("TRYON_COMPLETED_ROUTING_KEY", os.getenv("COMPLETED_ROUTING_KEY", "tryon.completed"))
    FAILED_ROUTING_KEY = os.getenv("TRYON_FAILED_ROUTING_KEY", os.getenv("FAILED_ROUTING_KEY", "tryon.failed"))

    # AI Config
    GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
    GMS_URL = "https://gms.ssafy.io/gmsapi/generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent"
