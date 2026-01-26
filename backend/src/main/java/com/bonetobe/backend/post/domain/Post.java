package com.bonetobe.backend.post.domain;

import com.bonetobe.backend.common.BaseEntity;
import com.bonetobe.backend.common.SkeletonType;
import com.bonetobe.backend.common.exception.BusinessException;
import com.bonetobe.backend.common.response.ErrorCode;
import com.bonetobe.backend.file.domain.StoredFile;
import com.bonetobe.backend.style.domain.Style;
import com.bonetobe.backend.user.domain.Gender;
import com.bonetobe.backend.user.domain.User;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

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
    @Column(nullable = false)
    private Gender gender;

    @Column(nullable = false)
    private Integer height;

    @Column(nullable = false)
    private Integer weight;

    @Enumerated(EnumType.STRING)
    private SkeletonType skeletonType;

    private String content;

    @Column(nullable = false)
    private long likeCount = 0L;

    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true)
    private final List<PostStyle> postStyles = new ArrayList<>();

    public static Post create(
            User user,
            StoredFile storedFile,
            String content,
            Gender gender,
            SkeletonType skeletonType,
            Integer height,
            Integer weight
    ) {
        Post post = new Post();
        post.user = user;
        post.storedFile = storedFile;
        post.content = content;
        post.gender = gender;
        post.skeletonType = skeletonType;
        post.height = height;
        post.weight = weight;

        return post;
    }


    public void applyStyles(List<Style> styles) {
        if (styles == null || styles.isEmpty()) return;

        for (Style style : styles) {
            if (style == null) continue;
            this.postStyles.add(PostStyle.create(this, style));
        }
    }

    public void updateContent(String content) {
        if (content == null || content.isBlank()) {
            throw new BusinessException(ErrorCode.BAD_REQUEST);
        }
        this.content = content;
    }

    public void updateSkeletonType(SkeletonType skeletonType) {
        if (skeletonType == null) throw new BusinessException(ErrorCode.BAD_REQUEST);
        this.skeletonType = skeletonType;
    }

    public void replaceStyles(List<Style> styles) {
        this.postStyles.clear();

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
