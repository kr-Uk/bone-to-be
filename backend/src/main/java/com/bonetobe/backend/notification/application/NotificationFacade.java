package com.bonetobe.backend.notification.application;

import com.bonetobe.backend.common.exception.BusinessException;
import com.bonetobe.backend.common.response.ErrorCode;
import com.bonetobe.backend.notification.domain.Notification;
import com.bonetobe.backend.notification.domain.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Objects;

@Component
@RequiredArgsConstructor
public class NotificationFacade {
    private final NotificationService notificationService;
    public void deleteNotifications(Long userId, Long notificationId) {
        Notification notification = notificationService.getNotification(notificationId);
        if (Objects.equals(notification.getUser().getId(), userId)) {
            throw new BusinessException(ErrorCode.FORBIDDEN);
        }

        notificationService.deleteNotifications(notification);
    }

    public void saveAndSendNotification(Notification notification) {
        notificationService.save(notification);
    }
}
