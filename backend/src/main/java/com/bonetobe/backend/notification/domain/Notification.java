package com.bonetobe.backend.notification.domain;

import com.bonetobe.backend.common.BaseEntity;
import com.bonetobe.backend.common.exception.BusinessException;
import com.bonetobe.backend.common.response.ErrorCode;
import com.bonetobe.backend.user.domain.User;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Entity
@Table(
        name = "notification",
        indexes = {
                // 특정 회원의 알림을 최신순으로 빠르게 조회하기 위한 복합 인덱스
                @Index(name = "idx_notification_member_created", columnList = "user_id, created_at DESC")
        }
)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
public class Notification extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    private Long domainId;

    @Column(nullable = false)
    private boolean isRead = false;

    @Enumerated(EnumType.STRING)
    @Column(name = "alert_type", nullable = false)
    private AlertType alertType;

    private String uuid;

    public static Notification create(
        Long userId,
        Long domainId,
        AlertType alertType
    ) {
        Notification notification = new Notification();
        notification.user = User.of(userId);
        notification.domainId = domainId;
        notification.alertType = alertType;
        notification.uuid = UUID.randomUUID().toString();
        return notification;
    }

    public void read() {
        if (isRead) {
            throw new BusinessException(ErrorCode.ALREADY_READ_NOTIFICATION);
        }

        isRead = true;
    }
}
