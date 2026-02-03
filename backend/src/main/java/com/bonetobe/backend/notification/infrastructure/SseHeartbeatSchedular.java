package com.bonetobe.backend.notification.infrastructure;

import com.bonetobe.backend.notification.adapter.SseEmitterRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class SseHeartbeatSchedular {

    private final SseEmitterRepository emitterRepository;

    @Scheduled(fixedRate = 30_000)
    public void heartbeat() {
        emitterRepository.getAllEmitters().forEach(emitter -> {
                try {
                    emitter.send(SseEmitter.event().comment("ping"));
                } catch (IOException ignored) {

                }
            }
        );
    }
}
