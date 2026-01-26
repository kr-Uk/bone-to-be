package com.bonetobe.backend.post.infrastructure;

import com.bonetobe.backend.post.domain.query.PostDetailSummaryRaw;
import com.querydsl.core.group.GroupBy;
import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.Expressions;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;

import static com.bonetobe.backend.file.domain.QStoredFile.storedFile;
import static com.bonetobe.backend.post.domain.QPost.post;
import static com.bonetobe.backend.post.domain.QPostStyle.postStyle;
import static com.bonetobe.backend.style.domain.QStyle.style;
import static com.bonetobe.backend.user.domain.QUser.user;

@Repository
@RequiredArgsConstructor
public class PostDetailQueryDslRepositoryImpl implements PostDetailQueryDslRepository {

    private final JPAQueryFactory qf;

    @Override
    public PostDetailSummaryRaw findPostDetail(Long postId) {

        List<PostDetailSummaryRaw> results = qf
                .from(post)
                .join(post.user, user)
                .join(post.storedFile, storedFile)
                .leftJoin(postStyle).on(postStyle.post.eq(post))
                .leftJoin(postStyle.style, style)
                .where(post.id.eq(postId))
                .transform(
                        GroupBy.groupBy(post.id).list(
                                Projections.constructor(
                                        PostDetailSummaryRaw.class,
                                        post.id,
                                        storedFile.id,
                                        GroupBy.list(style.styleName),
                                        post.gender,
                                        post.height,
                                        post.weight,
                                        post.skeletonType,
                                        post.content,
                                        post.likeCount,
                                        Expressions.FALSE,
                                        Projections.constructor(
                                                PostDetailSummaryRaw.AuthorSummary.class,
                                                user.id,
                                                user.nickname,
                                                Expressions.FALSE
                                        ),
                                        post.createdAt
                                )
                        )
                );

        return results.isEmpty() ? null : results.get(0);
    }

}
