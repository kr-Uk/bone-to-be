package com.bonetobe.backend.post.domain;

import com.bonetobe.backend.common.BaseEntity;
import com.bonetobe.backend.user.domain.User;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
public class Reply extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id")
    private Post post;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    private String content;

    @Column(nullable = false)
    private long likeCount = 0L;

    public static Reply create(
            Post post,
            User user,
            String content
    ){
        Reply reply = new Reply();
        reply.post = post;
        reply.user = user;
        reply.content = content;

        return reply;
    }
}
