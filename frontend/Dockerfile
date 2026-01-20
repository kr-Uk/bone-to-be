FROM node:22-alpine AS builder

RUN corepack enable
WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install

COPY . .
RUN pnpm build

# -----------------------------------

FROM nginx:1.25-alpine

# nginx 기본 설정 제거
RUN rm /etc/nginx/conf.d/default.conf

# 정적 파일 서빙 전용 설정
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /app/dist /usr/share/nginx/html
