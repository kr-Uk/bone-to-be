package com.bonetobe.backend.post.infrastructure;

import com.bonetobe.backend.common.SkeletonType;
import com.bonetobe.backend.post.domain.PostSort;
import com.bonetobe.backend.post.domain.query.PostListQuery;
import com.bonetobe.backend.post.domain.query.PostSummaryRaw;
import com.bonetobe.backend.style.domain.StyleName;
import com.bonetobe.backend.user.domain.Gender;
import com.querydsl.core.group.GroupBy;
import com.querydsl.core.types.OrderSpecifier;
import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.BooleanExpression;
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

import static com.bonetobe.backend.file.domain.QStoredFile.storedFile;
import static com.bonetobe.backend.post.domain.QPost.post;
import static com.bonetobe.backend.post.domain.QPostLike.postLike;
import static com.bonetobe.backend.post.domain.QPostStyle.postStyle;
import static com.bonetobe.backend.style.domain.QStyle.style;

@Repository
@RequiredArgsConstructor
public class PostQueryDslRepositoryImpl implements PostQueryDslRepository {

    private final JPAQueryFactory qf;

    @Override
    public Page<PostSummaryRaw> findPostList(PostListQuery c, Pageable pageable) {

        BooleanExpression[] conditions = new BooleanExpression[]{
                eqGender(c.gender()),
                eqSkeletonType(c.skeletonType()),
                betweenHeight(c.minHeight(), c.maxHeight()),
                betweenWeight(c.minWeight(), c.maxWeight()),
                inStyles(c.style())
        };

        // 총 개수
        JPAQuery<Long> countQuery = qf
                .select(post.id.count())
                .from(post)
                .where(conditions);

        List<OrderSpecifier<?>> orderSpecifiers = orderSpecifiers(c.postSort());

        // id만 뽑기
        List<Long> postIds = qf
                .select(post.id)
                .from(post)
                .where(conditions)
                .orderBy(orderSpecifiers.toArray(OrderSpecifier[]::new))
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();

        if (postIds.isEmpty()) {
            return Page.empty(pageable);
        }

        // id에 따라 상세조회
        List<PostSummaryRaw> content = qf
                .from(post)
                .join(post.storedFile, storedFile)
                .leftJoin(postStyle).on(postStyle.post.eq(post))
                .leftJoin(postStyle.style, style)
                .leftJoin(postLike)
                .on(
                        postLike.post.eq(post),
                        postLike.user.id.eq(c.viewerId())
                )
                .where(post.id.in(postIds))
                .orderBy(orderSpecifiers.toArray(OrderSpecifier[]::new))
                .transform(
                        GroupBy.groupBy(post.id).list(
                                Projections.constructor(
                                        PostSummaryRaw.class,
                                        post.id,
                                        storedFile.id,
                                        post.gender,
                                        post.skeletonType,
                                        GroupBy.list(style.styleName),
                                        post.height,
                                        post.weight,
                                        postLike.id.isNotNull(),
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
        return gender == null ? null : post.gender.eq(gender);
    }

    private BooleanExpression eqSkeletonType(SkeletonType skeletonType) {
        return skeletonType == null ? null : post.skeletonType.eq(skeletonType);
    }


    private BooleanExpression betweenHeight(Integer min, Integer max) {
        if (min == null && max == null) return null;
        if (min != null && max != null) return post.height.between(min, max);
        if (min != null) return post.height.goe(min);
        return post.height.loe(max);
    }

    private BooleanExpression betweenWeight(Integer min, Integer max) {
        if (min == null && max == null) return null;
        if (min != null && max != null) return post.weight.between(min, max);
        if (min != null) return post.weight.goe(min);
        return post.weight.loe(max);
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
