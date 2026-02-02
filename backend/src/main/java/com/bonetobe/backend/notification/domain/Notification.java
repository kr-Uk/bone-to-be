package com.bonetobe.backend.notification.domain;

import com.bonetobe.backend.common.BaseEntity;
import com.bonetobe.backend.user.domain.User;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

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

    private String relatedUrl;

    @Column(nullable = false)
    private boolean isRead = false;

    @Enumerated(EnumType.STRING)
    @Column(name = "alert_type", nullable = false)
    private AlertType alertType;

    private String uuid;
}
