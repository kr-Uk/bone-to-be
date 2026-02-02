package com.bonetobe.backend.notification.infrastructure;

import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.Collection;
import java.util.Optional;

public interface SseEmitterRepository {

    void save(Long userId, String emitterId, SseEmitter sseEmitter, long ttlMs);

    Optional<SseEmitter> findByUserId(Long userId);

    void remove(Long userId, String emitterId);

    String findEmitterId(Long userId);

    Collection<SseEmitter> getAllEmitters();
}
