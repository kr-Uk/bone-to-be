# 🧪 AI 워커 로컬 테스트 매뉴얼

이 가이드는 로컬 머신의 Docker 환경에서 `body-worker`를 테스트하는 방법을 안내합니다.

## 1. RabbitMQ 준비
RabbitMQ 서버가 실행 중이 아니라면, Docker를 사용해 실행해주세요:

```bash
docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3-management
```
- **관리자 페이지**: [http://localhost:15672](http://localhost:15672) (아이디/비번: guest/guest)

## 2. 워커 이미지 빌드
**반드시 `ai` 폴더**에서 실행해야 `shapy` 라이브러리를 포함할 수 있습니다.

```bash
# 'ai' 디렉토리로 이동
cd c:\Users\SSAFY\Desktop\S14P11D210\ai

# 이미지 빌드
docker build -t body-worker -f workers/body-worker/Dockerfile .
```
> **⚠️ 중요**: 명령어 끝에 있는 점 ` .` 과 띄어쓰기를 절대 잊지 마세요!

## 3. 워커 컨테이너 실행
빌드된 이미지를 실행합니다. 윈도우 Docker에서 로컬 호스트에 접근하려면 `host.docker.internal`을 사용합니다.

```bash
docker run -d ^
  --name body-worker-test ^
  --gpus all ^
  -e RABBITMQ_HOST=host.docker.internal ^
  -e RABBITMQ_PORT=5672 ^
  -e RABBITMQ_USERNAME=guest ^
  -e RABBITMQ_PASSWORD=guest ^
  -e REQUEST_QUEUE=body-worker.requested ^
  -e COMPLETED_QUEUE=body-worker.completed ^
  body-worker
```
> **참고**: `--gpus all` 옵션은 Docker가 GPU를 사용하도록 합니다. 설정이 안 되어 있다면 이 줄을 지우셔도 됩니다(CPU로 실행되며 느릴 수 있음).

## 4. 테스트 메시지 보내기
`ai` 폴더에서 새 터미널을 열고 테스트 스크립트를 실행하세요.

**방법 A: 웹 이미지 주소로 테스트 (CDN 시뮬레이션 - 추천)**
```bash
python send_test_message.py "https://raw.githubusercontent.com/ultralytics/yolov5/master/data/images/zidane.jpg"
```

**방법 B: 로컬 파일로 테스트**
*(참고: Docker 컨테이너가 로컬 파일에 접근하려면 볼륨 마운트 설정이 추가로 필요합니다. 간단한 테스트는 방법 A를 권장합니다.)*

## 5. 로그 확인 및 성공 여부
워커가 이미지를 잘 처리하고 있는지 실시간 로그를 확인합니다:

```bash
docker logs -f body-worker-test
```
**성공 메시지 예시:**
- `🌐 Downloading image from ...` (이미지 다운로드 중)
- `✅ Processing completed and published.` (처리 완료 및 결과 전송됨)

## 6. 종료 및 정리
테스트가 끝나면 워커를 종료하고 삭제합니다:
```bash
docker rm -f body-worker-test
```
