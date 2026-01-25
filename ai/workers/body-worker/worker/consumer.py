import json
from worker.rabbitmq import create_connection
from worker.config import Config
from worker.handlers.handler import handle

def start_consumer():
    conn = create_connection()
    ch = conn.channel()

    ch.queue_declare(queue=Config.REQUEST_QUEUE, durable=True)
    ch.basic_qos(prefetch_count=1)

    def callback(ch, method, properties, body):
        message = json.loads(body)
        print(f"▶ {Config.REQUEST_QUEUE} received")

        handle(message)

        ch.basic_ack(delivery_tag=method.delivery_tag)

    ch.basic_consume(
        queue=Config.REQUEST_QUEUE,
        on_message_callback=callback
    )

    print(f"🚀 {Config.REQUEST_QUEUE} worker started")
    ch.start_consuming()
