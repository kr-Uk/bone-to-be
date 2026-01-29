package com.bonetobe.backend.post.infrastructure;

import com.bonetobe.backend.post.domain.query.ReplySummaryRaw;
import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;

import static com.bonetobe.backend.post.domain.QReply.reply;
import static com.bonetobe.backend.post.domain.QReplyLike.replyLike;
import static com.bonetobe.backend.user.domain.QUser.user;

@Repository
@RequiredArgsConstructor
public class ReplyQueryDslRepositoryImpl implements ReplyQueryDslRepository {

    private final JPAQueryFactory qf;

    @Override
    public List<ReplySummaryRaw> findReplyList(Long postId, Long viewerId) {

        return qf
                .select(Projections.constructor(
                        ReplySummaryRaw.class,
                        reply.id,
                        Projections.constructor(
                                ReplySummaryRaw.AuthorSummary.class,
                                user.id,
                                user.profileImage.id,
                                user.nickname
                        ),
                        reply.content,
                        reply.likeCount,
                        replyLike.id.isNotNull(),
                        reply.user.id.eq(viewerId),
                        reply.createdAt
                ))
                .from(reply)
                .join(reply.user, user)
                .leftJoin(replyLike).on(
                        reply.id.eq(reply.id),
                        user.id.eq(viewerId)
                )
                .where(reply.post.id.eq(postId))
                .orderBy(reply.createdAt.desc())
                .fetch();
    }
}
