# 🦴 Bone To Be  
**골격 인식 기반 의류 추천 서비스**

사용자의 체형(골격)을 AI로 인식하여,  
체형에 적합한 의류를 추천하고 가상으로 착용해볼 수 있는 웹 서비스입니다.

---

## 📌 프로젝트 개요

- **프로젝트명**: Bone To Be  
- **프로젝트 형태**: 팀 프로젝트  
- **진행 기간**: 2026.01.12 ~ 2026.02.09  

본 프로젝트는 AI 기반 체형 인식 기술을 실제 웹 서비스에 적용하는 것을 목표로 합니다.

---

## 🏗️ 시스템 아키텍처

- Spring Boot 기반 메인 서버
- FastAPI 기반 AI 전용 서버
- RabbitMQ를 활용한 이벤트 기반 비동기 처리
- React + WebRTC 기반 클라이언트
- Nginx Reverse Proxy 및 정적 리소스 서빙


---

## ⚙️ 기술 스택

### Backend
- Java 21  
- Spring Boot 4.x  
- Spring Data JPA  
- QueryDSL  
- RabbitMQ  

### AI / ML
- MediaPipe Pose  
- 4D-Humans  
  - Human Pose Estimation  
  - 3D / 4D Skeleton Reconstruction  
  - PyTorch 기반 딥러닝 모델 활용  

### Frontend
- React  
- TypeScript  
- WebRTC  

### Database
- PostgreSQL  

### Infra / DevOps
- Docker  
- GitLab CI/CD  
- AWS EC2  
- Nginx  

---

## 🔑 핵심 기능

### 1. 회원 관리
- 회원가입 / 로그인
- 사용자 인증 및 세션 관리

### 2. 체형(골격) 인식
- WebRTC 기반 실시간 카메라 입력
- MediaPipe Pose를 활용한 2D Pose 추정
- 4D-Humans 기반 3D/4D Skeleton 데이터 생성
- FastAPI AI 서버에서 연산 후 결과 반환

### 3. 의류 추천
- 체형 데이터 기반 추천 로직 적용
- 사용자 체형 유형 분류
- 추천 결과 히스토리 관리

### 4. 가상 의류 착용 (Try-On)
- 인식된 골격 좌표를 활용한 의류 오버레이
- 체형에 따른 핏 시뮬레이션

### 5. 커뮤니티
- 체형별 코디 공유
- 게시글 및 댓글 기능
- 사용자 간 정보 교류

---

## 🔄 이벤트 기반 처리

- 체형 인식 요청 시 이벤트 발행
- RabbitMQ를 통해 AI 서버에 비동기 전달
- AI 처리 완료 후 결과를 메인 서버로 전달

**기대 효과**
- AI 연산으로 인한 API 응답 지연 최소화
- 서버 간 결합도 감소
- 확장성 있는 구조 확보

---

## 🚀 CI / CD & 배포

- GitLab CI를 통한 자동 빌드 및 테스트
- Docker 이미지 빌드 및 EC2 배포
- Nginx를 활용한 Reverse Proxy 구성


---

## ✨ 기대 효과

- AI 기반 체형 인식 기술의 실서비스 적용 경험
- 백엔드–AI 서버 분리 아키텍처 설계 경험
- 이벤트 기반 비동기 처리(RabbitMQ) 활용
- CI/CD 및 클라우드 배포 경험

---

## 👥 팀 프로젝트

- Backend / Frontend / AI 파트 협업
- Git 기반 협업 및 코드 리뷰 진행

---

## 📎 참고

본 프로젝트는 학습 및 포트폴리오 목적의 팀 프로젝트입니다.
