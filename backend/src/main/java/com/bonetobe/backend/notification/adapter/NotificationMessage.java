package com.bonetobe.backend.notification.adapter;

import com.bonetobe.backend.notification.domain.Notification;

import java.time.LocalDateTime;

public record NotificationMessage (
    String uuid,
    String type,
    String content,
    Long reportId,
    LocalDateTime createdAt
) {
    public static NotificationMessage of(Notification notification) {
        return new NotificationMessage(
            notification.getUuid(),
            notification.getAlertType().getName(),
            notification.getAlertType().getMessage(),
            notification.getDomainId(),
            notification.getCreatedAt()
        );
    }
}