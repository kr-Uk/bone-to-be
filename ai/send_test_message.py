import pika
import json
import os
import sys

# Load env to get config mostly, or just hardcode for test
# Assuming localhost:5672 guest/guest
RABBITMQ_HOST = "localhost"
RABBITMQ_PORT = 5672
RABBITMQ_USER = "guest"
RABBITMQ_PASS = "guest"
REQUEST_QUEUE = "body-worker.requested"

def send_test(image_path_or_url):
    credentials = pika.PlainCredentials(RABBITMQ_USER, RABBITMQ_PASS)
    params = pika.ConnectionParameters(
        host=RABBITMQ_HOST,
        port=RABBITMQ_PORT,
        credentials=credentials
    )
    
    try:
        conn = pika.BlockingConnection(params)
    except Exception as e:
        print(f"❌ Connection failed: {e}")
        print("Ensure RabbitMQ is running on localhost:5672")
        return

    ch = conn.channel()
    ch.queue_declare(queue=REQUEST_QUEUE, durable=True)

    message = {}
    if image_path_or_url.startswith("http"):
        message["image_url"] = image_path_or_url
    else:
        message["image_path"] = os.path.abspath(image_path_or_url)
    
    body = json.dumps(message)
    
    ch.basic_publish(
        exchange="",
        routing_key=REQUEST_QUEUE,
        body=body,
        properties=pika.BasicProperties(
            delivery_mode=2,  # persistent
        )
    )
    
    print(f"✅ Sent message to {REQUEST_QUEUE}: {body}")
    conn.close()

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python send_test_message.py <image_path_or_url>")
        sys.exit(1)
    
    target = sys.argv[1]
    send_test(target)
