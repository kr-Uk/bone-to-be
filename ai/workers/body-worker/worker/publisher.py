import json
import pika
from worker.rabbitmq import create_connection
from worker.config import Config

def publish(message: dict):
    """Publish a message to the appropriate queue based on status"""
    conn = create_connection()
    ch = conn.channel()
    
    # Declare exchange
    ch.exchange_declare(exchange=Config.EXCHANGE, exchange_type='topic', durable=True)
    
    # Determine routing key based on message status
    status = message.get('status', 'COMPLETED')
    
    if status == 'ERROR' or status == 'FAILED':
        # Declare failed queue
        ch.queue_declare(queue=Config.FAILED_QUEUE, durable=True)
        ch.queue_bind(
            exchange=Config.EXCHANGE,
            queue=Config.FAILED_QUEUE,
            routing_key=Config.FAILED_ROUTING_KEY
        )
        routing_key = Config.FAILED_ROUTING_KEY
    else:
        # Declare completed queue
        ch.queue_declare(queue=Config.COMPLETED_QUEUE, durable=True)
        ch.queue_bind(
            exchange=Config.EXCHANGE,
            queue=Config.COMPLETED_QUEUE,
            routing_key=Config.COMPLETED_ROUTING_KEY
        )
        routing_key = Config.COMPLETED_ROUTING_KEY
    
    # Publish message
    ch.basic_publish(
        exchange=Config.EXCHANGE,
        routing_key=routing_key,
        body=json.dumps(message),
        properties=pika.BasicProperties(delivery_mode=2)
    )
    
    conn.close()
    print(f"📤 Published to {routing_key}")
