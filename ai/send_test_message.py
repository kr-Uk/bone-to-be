import pika
import json
import os
import sys
import uuid
import time
from dotenv import load_dotenv

# Load env from body-worker/.env if possible, otherwise default
load_dotenv("workers/body-worker/.env")

RABBITMQ_HOST = os.getenv("RABBITMQ_HOST", "localhost")
RABBITMQ_PORT = int(os.getenv("RABBITMQ_PORT", 5672))
RABBITMQ_USER = os.getenv("RABBITMQ_USERNAME", "guest")
RABBITMQ_PASS = os.getenv("RABBITMQ_PASSWORD", "guest")
REQUEST_QUEUE = os.getenv("REQUEST_QUEUE", "body-worker.requested")
COMPLETED_QUEUE = os.getenv("COMPLETED_QUEUE", "body-worker.completed")

def test_worker(image_path_or_url, gender, height=None):
    print(f"[INFO] Connecting to RabbitMQ at {RABBITMQ_HOST}:{RABBITMQ_PORT}...")
    
    credentials = pika.PlainCredentials(RABBITMQ_USER, RABBITMQ_PASS)
    params = pika.ConnectionParameters(
        host=RABBITMQ_HOST,
        port=RABBITMQ_PORT,
        credentials=credentials
    )
    
    try:
        conn = pika.BlockingConnection(params)
    except Exception as e:
        print(f"Ensure RabbitMQ is running on {RABBITMQ_HOST}:{RABBITMQ_PORT}")
        return

    channel = conn.channel()
    
    # Declare queues
    channel.queue_declare(queue=REQUEST_QUEUE, durable=True)
    channel.queue_declare(queue=COMPLETED_QUEUE, durable=True)
    print(f"[OK] Queues declared: {REQUEST_QUEUE}, {COMPLETED_QUEUE}")

    # Prepare message
    message = {}
    if image_path_or_url.startswith("http"):
        message["image_url"] = image_path_or_url
    else:
        message["image_path"] = os.path.abspath(image_path_or_url)
    
    correlation_id = str(uuid.uuid4())
    message["correlation_id"] = correlation_id # Optional tracking
    message["gender"] = gender
    if height:
        message["height"] = height

    body = json.dumps(message)
    
    print(f"   Gender: {gender}, Height: {height}")
    print(f"   Image: {image_path_or_url[:80]}...")

    channel.basic_publish(
        exchange="",
        routing_key=REQUEST_QUEUE,
        body=body,
        properties=pika.BasicProperties(
            delivery_mode=2,  # persistent
        )
    )



    # Wait for response
    def on_response(ch, method, properties, body):
        response = json.loads(body)
        
        # Check if this response matches our request (simplistic check)
        # In a real app, match correlation_id
        req = response.get("request", {})
        
        print("\n📥 Received Response!")
        print(f"   Status: {response.get('status')}")
        
        if response.get("status") == "COMPLETED":
            result = response.get("result", {})
            print(f"   Result Keys: {list(result.keys())}")
            print(f"   (Full result hidden for brevity, check 'response_dump.json')")
            with open("response_dump.json", "w", encoding="utf-8") as f:
                json.dump(response, f, indent=2, ensure_ascii=False)
            print("   ✅ Valid output received. Saved to response_dump.json")
        else:
            print(f"   ❌ Error: {response.get('error') or response.get('message')}")

        ch.basic_ack(delivery_tag=method.delivery_tag)
        ch.stop_consuming()

    channel.basic_consume(queue=COMPLETED_QUEUE, on_message_callback=on_response)
    
    try:
        channel.start_consuming()
    except KeyboardInterrupt:
        print("Interrupted")
    finally:
        conn.close()

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python send_test_message.py <image_path_or_url> [gender=neutral] [height=None]")
        sys.exit(1)
    
    target = sys.argv[1]
    gender_arg = sys.argv[2] if len(sys.argv) > 2 else "neutral"
    height_arg = float(sys.argv[3]) if len(sys.argv) > 3 else None
    

    test_worker(target, gender_arg, height_arg)
