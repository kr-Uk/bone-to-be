import json
<<<<<<< Updated upstream
=======
import pika
>>>>>>> Stashed changes
from worker.rabbitmq import create_connection
from worker.config import Config

def publish(message: dict):
    conn = create_connection()
    ch = conn.channel()
<<<<<<< Updated upstream

    ch.queue_declare(queue=Config.COMPLETED_QUEUE, durable=True)

    ch.basic_publish(
        exchange="",
        routing_key=Config.COMPLETED_QUEUE,
        body=json.dumps(message),
        properties={"delivery_mode": 2}
    )

=======
    ch.queue_declare(queue=Config.COMPLETED_QUEUE, durable=True)
    ch.basic_publish(
        exchange="", 
        routing_key=Config.COMPLETED_QUEUE, 
        body=json.dumps(message), 
        properties=pika.BasicProperties(delivery_mode=2)
    )
>>>>>>> Stashed changes
    conn.close()
