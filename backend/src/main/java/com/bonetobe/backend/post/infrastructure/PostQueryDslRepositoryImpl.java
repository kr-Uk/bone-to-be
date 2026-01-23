package com.bonetobe.backend.post.infrastructure;

import com.bonetobe.backend.common.exception.BusinessException;
import com.bonetobe.backend.common.response.ErrorCode;
import com.bonetobe.backend.post.domain.query.PostListQuery;
import com.bonetobe.backend.post.domain.query.PostSummary;
import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.Expressions;
import com.querydsl.jpa.JPAExpressions;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.support.PageableExecutionUtils;
import org.springframework.stereotype.Repository;

import java.util.List;

import static com.bonetobe.backend.common.domain.QStoredFile.storedFile;
import static com.bonetobe.backend.member.domain.QProfile.profile;
import static com.bonetobe.backend.post.domain.QPost.post;
import static com.bonetobe.backend.post.domain.QPostLike.postLike;
import static com.bonetobe.backend.post.domain.QPostStyle.postStyle;
import static com.bonetobe.backend.style.domain.QStyle.style;

@Repository
@RequiredArgsConstructor
public class PostQueryDslRepositoryImpl implements PostQueryDslRepository {

    private final JPAQueryFactory qf;

    @Override
    public Page<PostSummary> findPostList(PostListQuery c, Pageable pageable) {

        // Where 조건
        BooleanBuilder where = new BooleanBuilder();

        if (c.gender() != null) {
            where.and(profile.gender.eq(c.gender()));
        }

        if (c.minHeight() != null) {
            where.and(profile.height.goe(c.minHeight()));
        }

        if (c.maxHeight() != null) {
            where.and(profile.height.loe(c.maxHeight()));
        }

        if (c.minWeight() != null) {
            where.and(profile.weight.goe(c.minWeight()));
        }

        if (c.maxWeight() != null) {
            where.and(profile.weight.loe(c.maxWeight()));
        }

        // 스타일 필터 (OR 조건)
        if (c.style() != null && !c.style().isEmpty()) {
            where.and(
                    post.id.in(
                            JPAExpressions
                                    .select(postStyle.post.id)
                                    .from(postStyle)
                                    .join(postStyle.style, style)
                                    .where(style.styleName.in(c.style()))
                    )
            );
        }

        // postId 페이징 조회
        // postId와 style이 1:n 관계여서 페이징이 깨질 수 있기 때문임
        List<Long> postIds;

        String sort = c.sort() == null ? "latest" : c.sort();

        if ("popular".equalsIgnoreCase(sort)) {
            postIds = qf
                    .select(post.id)
                    .from(post)
                    .join(post.user.profile, profile)
                    .leftJoin(postLike).on(postLike.post.eq(post))
                    .where(where)
                    .groupBy(post.id)
                    .orderBy(
                            postLike.id.count().desc(),
                            post.createdAt.desc()
                    )
                    .offset(pageable.getOffset())
                    .limit(pageable.getPageSize())
                    .fetch();
        } else if ("latest".equalsIgnoreCase(sort)) {
            postIds = qf
                    .select(post.id)
                    .from(post)
                    .join(post.user.profile, profile)
                    .where(where)
                    .orderBy(post.createdAt.desc())
                    .offset(pageable.getOffset())
                    .limit(pageable.getPageSize())
                    .fetch();
        } else {
            throw new BusinessException(ErrorCode.POST_LIST_INVALID_SORT);
        }

        if (postIds.isEmpty()) {
            return Page.empty(pageable);
        }

        // 데이터 조회
        List<PostSummary> content = qf
                .select(Projections.constructor(
                        PostSummary.class,
                        post.id,
                        storedFile.storagePath,
                        profile.gender.stringValue(),
                        post.skeletonType,
                        JPAExpressions
                                .select(style.styleName.stringValue())
                                .from(postStyle)
                                .join(postStyle.style, style)
                                .where(postStyle.post.eq(post)),
                        profile.height,
                        profile.weight,
                        // isLiked (로그인 미구현 → false)
                        Expressions.FALSE,
                        post.createdAt
                ))
                .from(post)
                .join(post.user.profile, profile)
                .join(post.storedFile, storedFile)
                .where(post.id.in(postIds))
                .orderBy(post.createdAt.desc())
                .fetch();

        // 총 개수
        var countQuery = qf
                .select(post.id.countDistinct())
                .from(post)
                .join(post.user.profile, profile)
                .where(where);

        return PageableExecutionUtils.getPage(
                content,
                pageable,
                countQuery::fetchOne
        );
    }
}
