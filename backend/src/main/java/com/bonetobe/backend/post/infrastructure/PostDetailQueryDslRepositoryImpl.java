package com.bonetobe.backend.post.infrastructure;

import com.bonetobe.backend.post.domain.query.PostDetailSummary;
import com.querydsl.core.group.GroupBy;
import com.querydsl.core.types.Expression;
import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.Expressions;
import com.querydsl.jpa.JPAExpressions;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;

import static com.bonetobe.backend.post.domain.QPost.post;
import static com.bonetobe.backend.post.domain.QPostStyle.postStyle;
import static com.bonetobe.backend.style.domain.QStyle.style;
import static com.bonetobe.backend.file.domain.QStoredFile.storedFile;
import static com.bonetobe.backend.user.domain.QUser.user;
import static com.bonetobe.backend.user.domain.QProfile.profile;

@Repository
@RequiredArgsConstructor
public class PostDetailQueryDslRepositoryImpl implements PostDetailQueryDslRepository {

    private final JPAQueryFactory qf;

    @Override
    public PostDetailSummary findPostDetail(Long postId) {

        var commentCountExpr = Expressions.constant(0L);

        List<PostDetailSummary> results = qf
                .from(post)
                .join(post.user, user)
                .join(user.profile, profile)
                .join(post.storedFile, storedFile)
                .leftJoin(postStyle).on(postStyle.post.eq(post))
                .leftJoin(postStyle.style, style)
                .where(post.id.eq(postId))
                .transform(
                        GroupBy.groupBy(post.id).list(
                                Projections.constructor(
                                        PostDetailSummary.class,
                                        post.id,
                                        storedFile.key,
                                        GroupBy.list(style.styleName),
                                        profile.gender,
                                        profile.height,
                                        profile.weight,
                                        post.skeletonType,
                                        post.content,
                                        post.likeCount,
                                        commentCountExpr,
                                        Expressions.FALSE,
                                        Projections.constructor(
                                                PostDetailSummary.AuthorSummary.class,
                                                user.id,
                                                // profile.profileImage, // TODO: 프로필 이미지
                                                user.nickname,
                                                Expressions.FALSE // TODO: isFollowing
                                        ),
                                        post.createdAt
                                )
                        )
                );

        return results.isEmpty() ? null : results.get(0);
    }
}
