package com.bonetobe.backend.post.domain;

import com.bonetobe.backend.common.BaseEntity;
import com.bonetobe.backend.style.domain.Style;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "post_style")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
public class PostStyle extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "style_id")
    private Style style;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id")
    private Post post;

    public static PostStyle create(Post post, Style style) {
        PostStyle ps = new PostStyle();
        ps.post = post;
        ps.style = style;
        return ps;
    }
}
