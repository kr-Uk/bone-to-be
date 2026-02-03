import json
from worker.rabbitmq import create_connection
from worker.config import Config
from worker.handlers.handler import handle

def start_consumer():
    conn = create_connection()
    ch = conn.channel()
    
    # Declare exchange
    ch.exchange_declare(exchange=Config.EXCHANGE, exchange_type='topic', durable=True)
    
    # Declare request queue
    ch.queue_declare(queue=Config.REQUEST_QUEUE, durable=True)
    
    # Bind queue to exchange with routing key
    ch.queue_bind(
        exchange=Config.EXCHANGE,
        queue=Config.REQUEST_QUEUE,
        routing_key=Config.REQUEST_ROUTING_KEY
    )
    
    ch.basic_qos(prefetch_count=1)

    def callback(ch, method, properties, body):
        try:
            message = json.loads(body)
            print(f"▶ {Config.REQUEST_QUEUE} received")
            handle(message)
            print(f"✅ {Config.REQUEST_QUEUE} processed")
        except Exception as e:
            print(f"❌ Error processing message: {e}")
            import traceback
            traceback.print_exc()
        finally:
            ch.basic_ack(delivery_tag=method.delivery_tag)

    ch.basic_consume(
        queue=Config.REQUEST_QUEUE,
        on_message_callback=callback
    )

    print(f"🚀 Try-on worker started")
    print(f"📡 Connected to RabbitMQ at: {Config.RABBITMQ_HOST}:{Config.RABBITMQ_PORT}")
    print(f"👂 Listening on {Config.REQUEST_QUEUE}")
    ch.start_consuming()
