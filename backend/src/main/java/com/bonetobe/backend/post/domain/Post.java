package com.bonetobe.backend.post.domain;

import com.bonetobe.backend.common.BaseEntity;
import com.bonetobe.backend.common.SkeletonType;
import com.bonetobe.backend.common.domain.StoredFile;
import com.bonetobe.backend.user.domain.User;
import com.bonetobe.backend.common.exception.BusinessException;
import com.bonetobe.backend.common.response.ErrorCode;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
public class Post extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "file_id")
    private StoredFile storedFile;

    @Enumerated(EnumType.STRING)
    private SkeletonType skeletonType;

    private String content;

    @Column(nullable = false)
    private long likeCount = 0L;

    public void increaseLike() {
        this.likeCount++;
    }

    public void decreaseLike() {
        if (this.likeCount == 0L) {
            throw new BusinessException(ErrorCode.POST_LIST_INVALID_LIKE);
        }
        this.likeCount--;
    }
}
