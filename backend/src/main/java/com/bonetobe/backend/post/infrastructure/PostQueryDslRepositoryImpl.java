package com.bonetobe.backend.post.infrastructure;

import com.bonetobe.backend.member.domain.Gender;
import com.bonetobe.backend.post.domain.PostSort;
import com.bonetobe.backend.post.domain.query.PostListQuery;
import com.bonetobe.backend.post.domain.query.PostSummary;
import com.bonetobe.backend.style.domain.StyleName;
import com.querydsl.core.group.GroupBy;
import com.querydsl.core.types.OrderSpecifier;
import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.core.types.dsl.Expressions;
import com.querydsl.jpa.JPAExpressions;
import com.querydsl.jpa.impl.JPAQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.support.PageableExecutionUtils;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

import static com.bonetobe.backend.common.domain.QStoredFile.storedFile;
import static com.bonetobe.backend.member.domain.QProfile.profile;
import static com.bonetobe.backend.post.domain.QPost.post;
import static com.bonetobe.backend.post.domain.QPostStyle.postStyle;
import static com.bonetobe.backend.style.domain.QStyle.style;

@Repository
@RequiredArgsConstructor
public class PostQueryDslRepositoryImpl implements PostQueryDslRepository {

    private final JPAQueryFactory qf;

    @Override
    public Page<PostSummary> findPostList(PostListQuery c, Pageable pageable) {

        // Where절 조건들
        BooleanExpression[] conditions = new BooleanExpression[]{
                eqGender(c.gender()),
                betweenHeight(c.minHeight(), c.maxHeight()),
                betweenWeight(c.minWeight(), c.maxWeight()),
                inStyles(c.style())
        };

        // 총 개수
        JPAQuery<Long> countQuery = qf
                .select(post.id.count())
                .from(post)
                .join(post.user.profile, profile)
                .where(conditions);

        // 정렬 스펙
        List<OrderSpecifier<?>> orderSpecifiers = orderSpecifiers(c.postSort());

        // postId 먼저 조회
        List<Long> postIds = qf
                .select(post.id)
                .from(post)
                .join(post.user.profile, profile)
                .where(conditions)
                .orderBy(orderSpecifiers.toArray(OrderSpecifier[]::new))
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();

        if (postIds.isEmpty()) {
            return Page.empty(pageable);
        }

        // 상세조회
        List<PostSummary> content = qf
                .from(post)
                .join(post.user.profile, profile)
                .join(post.storedFile, storedFile)
                .leftJoin(postStyle).on(postStyle.post.eq(post))
                .leftJoin(postStyle.style, style)
                .where(post.id.in(postIds))
                .orderBy(orderSpecifiers.toArray(OrderSpecifier[]::new))
                .transform(
                        GroupBy.groupBy(post.id).list(
                                Projections.constructor(
                                        PostSummary.class,
                                        post.id,
                                        storedFile.storagePath,
                                        profile.gender.stringValue(),
                                        post.skeletonType,
                                        GroupBy.list(style.styleName.stringValue()),
                                        profile.height,
                                        profile.weight,
                                        Expressions.FALSE,
                                        post.createdAt
                                )
                        )
                );

        return PageableExecutionUtils.getPage(
                content,
                pageable,
                countQuery::fetchOne
        );

    }

    private List<OrderSpecifier<?>> orderSpecifiers(PostSort sort) {
        List<OrderSpecifier<?>> specifiers = new ArrayList<>(List.of(
                post.createdAt.desc(),
                post.id.desc()
        ));

        if (sort == PostSort.POPULAR) {
            specifiers.add(0, post.likeCount.desc());
        }

        return specifiers;
    }

    private BooleanExpression eqGender(Gender gender) {
        return gender == null ? null : profile.gender.eq(gender);
    }

    private BooleanExpression betweenHeight(Integer min, Integer max) {
        if (min == null && max == null) return null;
        if (min != null && max != null) return profile.height.between(min, max);
        if (min != null) return profile.height.goe(min);
        return profile.height.loe(max);
    }

    private BooleanExpression betweenWeight(Integer min, Integer max) {
        if (min == null && max == null) return null;
        if (min != null && max != null) return profile.weight.between(min, max);
        if (min != null) return profile.weight.goe(min);
        return profile.weight.loe(max);
    }

    private BooleanExpression inStyles(List<StyleName> styles) {
        if (styles == null || styles.isEmpty()) return null;

        return post.id.in(
                JPAExpressions
                        .select(postStyle.post.id)
                        .from(postStyle)
                        .join(postStyle.style, style)
                        .where(style.styleName.in(styles))
        );
    }
}