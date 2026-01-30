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
import java.util.Objects;

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

    @Column(nullable = false)
    private long commentCount = 0L;


    // 양방향은 순환참조의 위험이 있음 -> Join으로
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

    public static Post of(Long postId) {
        Post post = new Post();
        post.id = postId;
        return post;
    }

    public void applyStyles(List<Style> styles) {
        if (styles == null) return;
        styles.stream()
                .filter(Objects::nonNull)
                .forEach(style ->
                        postStyles.add(PostStyle.create(this, style))
                );

    }

    public void update(
            String content,
            Gender gender,
            SkeletonType skeletonType,
            List<Style> styles,
            Integer height,
            Integer weight
    ) {
        this.content = content;
        this.gender = gender;
        this.skeletonType = skeletonType;
        this.height = height;
        this.weight = weight;
        updateStyles(styles);
    }

    public void updateStyles(List<Style> styles) {
        postStyles.clear();
        applyStyles(styles);
    }
}
