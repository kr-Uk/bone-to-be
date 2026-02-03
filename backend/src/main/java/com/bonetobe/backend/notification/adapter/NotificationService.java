package com.bonetobe.backend.notification.adapter;

import com.bonetobe.backend.notification.domain.Notification;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.List;

public interface NotificationService {
    SseEmitter subscribe(Long userId);

    void send(Long userId, Notification data);

    List<Notification> getNotifications(Long userId);

    Notification getNotification(String id);

    void deleteNotifications(Notification notification);

    void save(Notification notification);
}
