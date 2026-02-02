package com.bonetobe.backend.notification.domain;

import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.List;

public interface NotificationService {
    SseEmitter subscribe(Long userId);

    void send(Long userId, Object data);

    List<Notification> getNotifications(Long userId);

    Notification getNotification(Long id);

    void deleteNotifications(Notification notification);
}
