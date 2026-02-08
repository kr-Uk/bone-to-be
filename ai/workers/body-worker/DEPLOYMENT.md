### Deployment Instructions (Ubuntu/Docker)

To build and run the body-worker on Ubuntu (or any Docker environment), you must use the `ai` directory as the build context.

#### 1. Build the Docker Image
Navigate to the `ai` root directory:
```bash
cd /path/to/S14P11D210/ai
```

Run the build command:
```bash
docker build -t body-worker -f workers/body-worker/Dockerfile .
```
> **Note:** The `.` at the end is crucial. It sets the build context to the current folder (`ai`), allowing the Dockerfile to access the `shapy` directory.

#### 2. Run the Worker
Ensure your RabbitMQ is accessible. If running RabbitMQ in Docker on the same host, use `--network host` or link the containers.

```bash
docker run -d \
  --name body-worker-instance \
  --network host \
  -e RABBITMQ_HOST=localhost \
  -e RABBITMQ_PORT=5672 \
  -e RABBITMQ_USERNAME=guest \
  -e RABBITMQ_PASSWORD=guest \
  -e REQUEST_QUEUE=body-worker.requested \
  -e COMPLETED_QUEUE=body-worker.completed \
  body-worker
```

The worker is now ready to process messages containing `image_url` from the CDN.
