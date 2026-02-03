package com.bonetobe.backend.notification.presentation;

import com.bonetobe.backend.notification.domain.Notification;

import java.time.LocalDateTime;

public record GetNotification(
        String uuid,
        String type,
        String content,
        Long reportId,
        LocalDateTime createdAt
) {
    public static GetNotification of(Notification notification) {
        return new GetNotification(
            notification.getUuid(),
            notification.getAlertType().getName(),
            notification.getAlertType().getMessage(),
            notification.getDomainId(),
            notification.getCreatedAt()
        );
    }
}