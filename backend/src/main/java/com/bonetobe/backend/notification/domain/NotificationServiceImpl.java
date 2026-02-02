package com.bonetobe.backend.notification.domain;

import com.bonetobe.backend.notification.infrastructure.SseEmitterRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {
    private final long SSE_TIMEOUT_MS = 60_000L;
    private final long REDIS_TTL_MS = 80_000L;
    private final SseEmitterRepository emitterRepository;

    public SseEmitter subscribe(Long userId) {
        // 1. 항상 새 emitter 생성
        SseEmitter emitter = new SseEmitter(SSE_TIMEOUT_MS);

        String emitterId = UUID.randomUUID().toString();

        // 2. 생명주기 콜백 등록
        emitter.onCompletion(() -> cleanup(userId, emitterId));
        emitter.onTimeout(() -> cleanup(userId, emitterId));
        emitter.onError(e -> cleanup(userId, emitterId));

        // 3. emitter 등록 (메모리 + Redis 메타)
        emitterRepository.save(userId, emitterId, emitter, REDIS_TTL_MS);

        // (선택) 연결 직후 더미 이벤트 – 프록시/LB 안정화
        try {
            emitter.send(SseEmitter.event().comment("connected"));
        } catch (IOException e) {
            cleanup(userId, emitterId);
        }

        return emitter;
    }

    private void cleanup(Long userId, String emitterId) {
        emitterRepository.remove(userId, emitterId);
    }
}
