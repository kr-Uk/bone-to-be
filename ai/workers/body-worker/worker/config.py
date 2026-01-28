import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    RABBITMQ_HOST = os.getenv("RABBITMQ_HOST")
    RABBITMQ_PORT = int(os.getenv("RABBITMQ_PORT", 5672))
    RABBITMQ_USERNAME = os.getenv("RABBITMQ_USERNAME")
    RABBITMQ_PASSWORD = os.getenv("RABBITMQ_PASSWORD")
    RABBITMQ_VHOST = os.getenv("RABBITMQ_VHOST", "/")
    
    # Queue names
    REQUEST_QUEUE = os.getenv("REQUEST_QUEUE")
    COMPLETED_QUEUE = os.getenv("COMPLETED_QUEUE")
    FAILED_QUEUE = os.getenv("FAILED_QUEUE")
    
    # Exchange and routing keys
    EXCHANGE = os.getenv("EXCHANGE", "analysis.exchange")
    REQUEST_ROUTING_KEY = os.getenv("REQUEST_ROUTING_KEY", "analysis.requested")
    COMPLETED_ROUTING_KEY = os.getenv("COMPLETED_ROUTING_KEY", "analysis.completed")
    FAILED_ROUTING_KEY = os.getenv("FAILED_ROUTING_KEY", "analysis.failed")
