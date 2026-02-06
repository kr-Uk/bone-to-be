package com.bonetobe.backend.user.infrastructure;

import com.bonetobe.backend.user.domain.query.UserSearchSummaryRaw;
import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;

import static com.bonetobe.backend.user.domain.QFollow.follow;
import static com.bonetobe.backend.user.domain.QUser.user;

@Repository
@RequiredArgsConstructor
public class UserQueryDslRepositoryImpl implements UserQueryDslRepository {

    private final JPAQueryFactory qf;

    @Override
    public List<UserSearchSummaryRaw> findUserSearch(String nickname, Long viewerId) {

        BooleanExpression notMeCond =
                (viewerId != null) ? user.id.ne(viewerId) : null;

        return qf
                .select(Projections.constructor(
                        UserSearchSummaryRaw.class,
                        user.id,
                        user.nickname,
                        user.profileImage.id,
                        follow.id.isNotNull()
                ))
                .from(user)
                .leftJoin(follow)
                .on(
                        follow.follower.id.eq(viewerId),
                        follow.following.id.eq(user.id)
                )
                .where(
                        user.isDeleted.isFalse(),
                        user.nickname.contains(nickname),
                        notMeCond)
                .fetch();
    }
}
