import pika
from worker.config import Config

def create_connection():
    credentials = pika.PlainCredentials(
        Config.RABBITMQ_USERNAME,
        Config.RABBITMQ_PASSWORD
    )

    params = pika.ConnectionParameters(
        host=Config.RABBITMQ_HOST,
        port=Config.RABBITMQ_PORT,
        virtual_host=Config.RABBITMQ_VHOST,
        credentials=credentials,
        heartbeat=60
    )

    return pika.BlockingConnection(params)
