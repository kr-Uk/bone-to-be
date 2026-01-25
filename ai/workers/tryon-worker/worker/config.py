import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    RABBITMQ_HOST = os.getenv("RABBITMQ_HOST")
    RABBITMQ_PORT = int(os.getenv("RABBITMQ_PORT", 5672))
    RABBITMQ_USERNAME = os.getenv("RABBITMQ_USERNAME")
    RABBITMQ_PASSWORD = os.getenv("RABBITMQ_PASSWORD")
    RABBITMQ_VHOST = os.getenv("RABBITMQ_VHOST", "/")

    REQUEST_QUEUE = os.getenv("REQUEST_QUEUE")
    COMPLETED_QUEUE = os.getenv("COMPLETED_QUEUE")
