package com.bonetobe.backend.notification.infrastructure;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Repository;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.Collection;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;

@Repository
@RequiredArgsConstructor
public class SseEmitterRepositoryImpl implements SseEmitterRepository {

    private final Map<String, SseEmitter> localEmitters = new ConcurrentHashMap<>();
    private final StringRedisTemplate redisTemplate;

    @Override
    public void save(Long userId, String emitterId, SseEmitter sseEmitter, long ttlMs) {
        localEmitters.put(emitterId, sseEmitter);

        redisTemplate.opsForValue()
            .set(redisKey(userId), emitterId, ttlMs, TimeUnit.MILLISECONDS);
    }

    @Override
    public Optional<SseEmitter> findByUserId(Long userId) {
        String emitterId = findEmitterId(userId);

        if (emitterId == null) {
            return Optional.empty();
        }

        return Optional.ofNullable(localEmitters.get(emitterId));
    }

    @Override
    public void remove(Long userId, String emitterId) {
        localEmitters.remove(emitterId);
        redisTemplate.delete(redisKey(userId));
    }

    @Override
    public String findEmitterId(Long userId) {
        return redisTemplate.opsForValue().get(redisKey(userId));
    }

    @Override
    public Collection<SseEmitter> getAllEmitters() {
        return localEmitters.values();
    }

    private String redisKey(Long userId) {
        return "sse:emitter:user" + userId;
    }
}
