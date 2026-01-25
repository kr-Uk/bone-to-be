package com.bonetobe.backend.post.domain;

import com.bonetobe.backend.common.BaseEntity;
import com.bonetobe.backend.common.SkeletonType;
import com.bonetobe.backend.file.domain.StoredFile;
import com.bonetobe.backend.style.domain.Style;
import com.bonetobe.backend.user.domain.User;
import com.bonetobe.backend.common.exception.BusinessException;
import com.bonetobe.backend.common.response.ErrorCode;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

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

    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true)
    private final List<PostStyle> postStyles = new ArrayList<>();

    public static Post create(User user, StoredFile storedFile, SkeletonType skeletonType, String content) {
        if (user == null) throw new BusinessException(ErrorCode.BAD_REQUEST);
        if (storedFile == null) throw new BusinessException(ErrorCode.BAD_REQUEST);
        if (skeletonType == null) throw new BusinessException(ErrorCode.BAD_REQUEST);

        Post post = new Post();
        post.user = user;
        post.storedFile = storedFile;
        post.skeletonType = skeletonType;
        post.content = content;

        return post;
    }

    public void applyStyles(List<Style> styles) {
        if (styles == null || styles.isEmpty()) return;

        for (Style style : styles) {
            if (style == null) continue;
            this.postStyles.add(PostStyle.create(this, style));
        }
    }


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
