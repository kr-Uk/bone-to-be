package com.bonetobe.backend.post.infrastructure;

import com.bonetobe.backend.file.domain.QStoredFile;
import com.bonetobe.backend.post.domain.query.PostDetailSummaryRaw;
import com.querydsl.core.group.GroupBy;
import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;

import static com.bonetobe.backend.file.domain.QStoredFile.storedFile;
import static com.bonetobe.backend.post.domain.QPost.post;
import static com.bonetobe.backend.post.domain.QPostLike.postLike;
import static com.bonetobe.backend.post.domain.QPostStyle.postStyle;
import static com.bonetobe.backend.style.domain.QStyle.style;
import static com.bonetobe.backend.user.domain.QFollow.follow;
import static com.bonetobe.backend.user.domain.QUser.user;

@Repository
@RequiredArgsConstructor
public class PostDetailQueryDslRepositoryImpl implements PostDetailQueryDslRepository {

    private final JPAQueryFactory qf;

    @Override
    public PostDetailSummaryRaw findPostDetail(Long postId, Long viewerId) {

        // 포스트 사진 파일과 작성자 프로필 사진 파일 alias 충돌 방지
        QStoredFile profileFile = new QStoredFile("profileFile");

        List<PostDetailSummaryRaw> results = qf
                .from(post)
                .join(post.user, user)
                .join(post.storedFile, storedFile)
                .leftJoin(user.profileImage, profileFile)
                .leftJoin(postStyle).on(postStyle.post.eq(post))
                .leftJoin(postStyle.style, style)
                .leftJoin(postLike)
                .on(
                        postLike.post.eq(post),
                        postLike.user.id.eq(viewerId)
                )
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
                                        postLike.id.isNotNull(),
                                        Projections.constructor(
                                                PostDetailSummaryRaw.AuthorSummary.class,
                                                user.id,
                                                profileFile.id,
                                                user.nickname
                                        ),
                                        post.createdAt
                                )
                        )
                );

        return results.isEmpty() ? null : results.get(0);
    }

}
