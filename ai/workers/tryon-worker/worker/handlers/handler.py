from worker.publisher import publish
import time

def handle(message: dict):
    print("⚙️ processing...")
    time.sleep(2)

    publish({
        "request": message,
        "status": "COMPLETED"
    })
