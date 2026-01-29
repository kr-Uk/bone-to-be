package com.bonetobe.backend.post.domain;

import com.bonetobe.backend.common.BaseEntity;
import com.bonetobe.backend.user.domain.User;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(
        name = "reply_like",
        // 동일한 사용자가 동일한 댓글에 좋아요 X -> 중복 좋아요 방지
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_reply_like_reply_user",
                        columnNames = {"reply_id", "user_id"}
                )
        },
        // 좋아요 삭제 등 조회 성능 높임
        indexes = {
                @Index(name = "idx_reply_like_reply_id", columnList = "reply_id"),
                @Index(name = "idx_reply_like_user_id", columnList = "user_id")
        }
)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
public class ReplyLike extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reply_id")
    private Reply reply;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;
}
