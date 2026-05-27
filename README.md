<h1 align="center">🦴 Bone To Be — AI 골격 인식 기반 의류 추천 서비스</h1>

<p align="center">
  사용자의 체형(골격)을 AI로 인식해 적합한 의류를 추천하고 <b>가상 착용(Try-On)</b>까지 제공하는 웹 서비스<br/>
  <em>Spring Boot 메인 서버와 FastAPI AI 서버를 RabbitMQ로 분리한 이벤트 기반 아키텍처</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Java-17-007396?style=flat-square&logo=openjdk&logoColor=white"/>
  <img src="https://img.shields.io/badge/Spring%20Boot-3.5.9-6DB33F?style=flat-square&logo=springboot&logoColor=white"/>
  <img src="https://img.shields.io/badge/QueryDSL-5.0-0769AD?style=flat-square"/>
  <img src="https://img.shields.io/badge/RabbitMQ-FF6600?style=flat-square&logo=rabbitmq&logoColor=white"/>
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white"/>
  <img src="https://img.shields.io/badge/Grafana-F46800?style=flat-square&logo=grafana&logoColor=white"/>
</p>

---

## 📌 프로젝트 개요

| 항목 | 내용 |
|:---:|---|
| **기간** | 2026.01.12 ~ 2026.02.09 (약 4주) |
| **형태** | 팀 프로젝트 (6인 · 백엔드 3명) |
| **담당** | **백엔드** — 커뮤니티 API 설계·구현 · S3 파일 업로드 · 모니터링 환경 구축 |
| **한줄 소개** | AI 체형 인식으로 골격 유형을 판별하고 맞춤 의류를 추천·가상 착용하는 서비스 |

---

## 🛠️ 기술 스택

| 분류 | 기술 |
|:---:|---|
| **Backend** | Java 17 · Spring Boot 3.5.9 · Spring Data JPA · QueryDSL 5.0 · Spring AMQP(RabbitMQ) |
| **Storage** | AWS S3 (Spring Cloud AWS) — Presigned URL 업로드 |
| **AI Server** | FastAPI · MediaPipe Pose · 4D-Humans · PyTorch |
| **Database** | PostgreSQL |
| **Monitoring** | Prometheus · Grafana · Loki · Promtail |
| **Infra** | Docker · GitLab CI/CD · AWS EC2 · Nginx |

---

## 🏗️ 시스템 아키텍처

![BoneToBe Architecture](docs/architecture.png)

- **Spring Boot 메인 서버 ↔ FastAPI AI 서버**를 RabbitMQ로 분리
- 체형 분석/Try-On 요청을 이벤트로 발행 → AI 서버가 비동기 처리 → 결과 큐로 회신
- 도메인 주도 설계(9개 바운디드 컨텍스트) + Facade 패턴으로 트랜잭션·이벤트 조율

---

## ✨ 핵심 기능

### 1. 커뮤니티 (담당)
- 체형별 코디 공유 피드 — 게시글 CRUD · 댓글 · 좋아요 · 스크랩
- 스타일·성별·체형 타입 등 **다중 조건 필터링**(QueryDSL 동적 쿼리)
- 다양한 디자인 패턴을 적용해 도메인 로직과 영속성 분리

### 2. 모니터링 환경 구축 (담당)
- Prometheus 메트릭 수집 + **Grafana 대시보드**
- **Loki + Promtail** 로그 수집 파이프라인으로 팀 협업 디버깅 효율 개선

### 3. AI 체형 인식 & 가상 착용 (협업)
- WebRTC 카메라 입력 → MediaPipe Pose(2D) → 4D-Humans(3D/4D Skeleton)
- 인식 골격 좌표 기반 의류 오버레이 / 핏 시뮬레이션

### 4. 이벤트 기반 비동기 처리
- RabbitMQ Manual ACK로 메시지 손실 방지
- AI 연산 지연을 사용자 응답 흐름에서 격리 → 응답성·확장성 확보

---

## 🚀 CI/CD & 배포

- GitLab CI로 자동 빌드·테스트 → Docker 이미지 빌드 → EC2 배포
- Nginx Reverse Proxy 구성

---

## 🔧 트러블슈팅 & 기술적 의사결정

<details>
<summary><b>S3 Presigned URL — 3단계 파일 라이프사이클 관리</b></summary>

> 이미지를 서버가 중계 업로드하면 트래픽·메모리 부담이 큽니다. **Presigned URL**을 발급해 클라이언트가 S3에 직접 업로드하도록 분산하되, "URL만 받고 실제 업로드는 안 한" orphan 파일 문제를 막기 위해 파일 상태를 `REQUESTED`(발급) → `UPLOADED` → `CONFIRMED`로 추적하도록 설계했습니다. 업로드 완료 처리 시 **소유자 검증**을 거쳐 권한 없는 파일 확정을 차단합니다.
</details>

<details>
<summary><b>커뮤니티 피드 집계 조회 — N+1 회피 + 외부 호출 분리</b></summary>

> 게시글 목록은 각 글마다 좋아요 수·댓글 수·내가 좋아요/스크랩했는지를 함께 보여줘야 해 단순 조회 시 N+1이 발생합니다. QueryDSL projection(`PostDetailSummaryRaw`)으로 **집계값을 한 번의 쿼리로** 가져오고, 이미지 Presigned URL 생성은 DB 쿼리와 분리해 일괄 매핑(`toSummary`)하도록 구성했습니다. (DB 조회 ↔ S3 호출 책임 분리)
</details>

<details>
<summary><b>커뮤니티 다중 조건 검색 — QueryDSL 동적 쿼리</b></summary>

> 스타일·성별·체형 타입 등 선택적 필터 조합을 정적 SQL로 처리하면 분기가 폭발합니다. QueryDSL `BooleanBuilder`로 조건을 동적 조립해 단일 쿼리로 처리했습니다.
</details>

<details>
<summary><b>모니터링 환경 구축 — Grafana + Loki</b></summary>

> 팀이 운영 중 문제를 빠르게 파악하도록 Prometheus 메트릭 + Grafana 대시보드와 Loki/Promtail 로그 수집 파이프라인을 구축해, 흩어진 컨테이너 로그를 한 곳에서 조회·디버깅할 수 있게 했습니다.
</details>
