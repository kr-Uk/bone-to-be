#!/bin/bash

PROJECT=ai-worker

mkdir -p $PROJECT/worker/handlers
cd $PROJECT || exit

# requirements
cat <<EOF > requirements.txt
pika==1.3.2
python-dotenv==1.0.1
EOF

# env
cat <<EOF > .env
RABBITMQ_HOST=localhost
RABBITMQ_PORT=5672
RABBITMQ_USERNAME=guest
RABBITMQ_PASSWORD=guest
RABBITMQ_VHOST=/

ANALYSIS_REQUEST_QUEUE=analysis.requested
ANALYSIS_COMPLETED_QUEUE=analysis.completed

TRYON_REQUEST_QUEUE=tryon.requested
TRYON_COMPLETED_QUEUE=tryon.requested
EOF

# main
cat <<EOF > main.py
from worker.consumer import start_consumer

if __name__ == "__main__":
    start_consumer()
EOF

# config
cat <<EOF > worker/config.py
import os
from dotenv import load_dotenv

load_dotenv()

class RabbitConfig:
    HOST = os.getenv("RABBITMQ_HOST")
    PORT = int(os.getenv("RABBITMQ_PORT"))
    USERNAME = os.getenv("RABBITMQ_USERNAME")
    PASSWORD = os.getenv("RABBITMQ_PASSWORD")
    VHOST = os.getenv("RABBITMQ_VHOST")

    ANALYSIS_REQUEST_QUEUE = os.getenv("ANALYSIS_REQUEST_QUEUE")
    ANALYSIS_COMPLETED_QUEUE = os.getenv("ANALYSIS_COMPLETED_QUEUE")
    TRYON_REQUEST_QUEUE = os.getenv("TRYON_REQUEST_QUEUE")
    TRYON_COMPLETED_QUEUE = os.getenv("TRYON_COMPLETED_QUEUE")
EOF

# rabbitmq
cat <<EOF > worker/rabbitmq.py
import pika
from worker.config import RabbitConfig

def create_connection():
    credentials = pika.PlainCredentials(
        RabbitConfig.USERNAME,
        RabbitConfig.PASSWORD
    )

    params = pika.ConnectionParameters(
        host=RabbitConfig.HOST,
        port=RabbitConfig.PORT,
        virtual_host=RabbitConfig.VHOST,
        credentials=credentials,
        heartbeat=60
    )

    return pika.BlockingConnection(params)
EOF

# publisher
cat <<EOF > worker/publisher.py
import json
from worker.rabbitmq import create_connection

def publish(queue: str, message: dict):
    conn = create_connection()
    ch = conn.channel()

    ch.queue_declare(queue=queue, durable=True)

    ch.basic_publish(
        exchange="",
        routing_key=queue,
        body=json.dumps(message),
        properties={"delivery_mode": 2}
    )

    conn.close()
EOF

# consumer
cat <<EOF > worker/consumer.py
import json
from worker.rabbitmq import create_connection
from worker.config import RabbitConfig
from worker.handlers.analysis_handler import handle_analysis
from worker.handlers.tryon_handler import handle_tryon

def start_consumer():
    conn = create_connection()
    ch = conn.channel()

    ch.queue_declare(queue=RabbitConfig.ANALYSIS_REQUEST_QUEUE, durable=True)
    ch.queue_declare(queue=RabbitConfig.TRYON_REQUEST_QUEUE, durable=True)

    ch.basic_qos(prefetch_count=1)

    def callback(ch, method, props, body):
        message = json.loads(body)
        routing_key = method.routing_key

        print("▶ received:", routing_key)

        if routing_key == RabbitConfig.ANALYSIS_REQUEST_QUEUE:
            handle_analysis(message)
        elif routing_key == RabbitConfig.TRYON_REQUEST_QUEUE:
            handle_tryon(message)

        ch.basic_ack(delivery_tag=method.delivery_tag)

    ch.basic_consume(
        queue=RabbitConfig.ANALYSIS_REQUEST_QUEUE,
        on_message_callback=callback
    )

    ch.basic_consume(
        queue=RabbitConfig.TRYON_REQUEST_QUEUE,
        on_message_callback=callback
    )

    print("🚀 AI Worker running")
    ch.start_consuming()
EOF

# handlers
cat <<EOF > worker/handlers/analysis_handler.py
from worker.publisher import publish
from worker.config import RabbitConfig
import time

def handle_analysis(message):
    print("🧠 analyzing...")
    time.sleep(2)

    publish(RabbitConfig.ANALYSIS_COMPLETED_QUEUE, {
        "analysisId": message["analysisId"],
        "bodyType": "STRAIGHT"
    })
EOF

cat <<EOF > worker/handlers/tryon_handler.py
from worker.publisher import publish
from worker.config import RabbitConfig
import time

def handle_tryon(message):
    print("👕 try-on...")
    time.sleep(3)

    publish(RabbitConfig.TRYON_COMPLETED_QUEUE, {
        "analysisId": message["analysisId"],
        "resultKey": "tryon/result.png"
    })
EOF

echo "✅ ai-worker project created"

