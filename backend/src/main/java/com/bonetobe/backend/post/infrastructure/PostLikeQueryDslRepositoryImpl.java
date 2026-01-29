package com.bonetobe.backend.post.infrastructure;

import com.bonetobe.backend.post.domain.query.PostLikeUserSummaryRaw;
import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;

import static com.bonetobe.backend.post.domain.QPostLike.postLike;
import static com.bonetobe.backend.user.domain.QFollow.follow;
import static com.bonetobe.backend.user.domain.QUser.user;

@Repository
@RequiredArgsConstructor
public class PostLikeQueryDslRepositoryImpl implements PostLikeQueryDslRepository {

    private final JPAQueryFactory qf;

    @Override
    public List<PostLikeUserSummaryRaw> findPostLikeUsers(Long postId, Long viewerId) {

        return qf
                .select(Projections.constructor(
                        PostLikeUserSummaryRaw.class,
                        user.id,
                        user.nickname,
                        user.profileImage.id,
                        follow.id.isNotNull()
                ))
                .from(postLike)
                .join(postLike.user, user)
                .leftJoin(follow)
                .on(
                        follow.follower.id.eq(viewerId),
                        follow.following.id.eq(user.id)
                )
                .where(postLike.post.id.eq(postId))
                .orderBy(postLike.createdAt.desc())
                .fetch();
    }
}
