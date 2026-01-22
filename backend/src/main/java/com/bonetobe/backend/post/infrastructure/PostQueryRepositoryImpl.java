package com.bonetobe.backend.post.infrastructure;

import com.bonetobe.backend.post.application.query.PostListSearchCondition;
import com.bonetobe.backend.post.application.query.PostQueryRepository;
import com.bonetobe.backend.post.application.query.PostSummary;
import com.bonetobe.backend.post.application.query.PostSummaryRow;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.*;
import java.util.stream.Collectors;

@Repository
@RequiredArgsConstructor
public class PostQueryRepositoryImpl implements PostQueryRepository {

    @PersistenceContext
    private final EntityManager em;

    @Override
    public Page<PostSummary> findPostList(PostListSearchCondition condition, Pageable pageable) {
        String sort = condition.sortOrDefault(); // latest | popular

        // 1) postIds만 조건/정렬/페이징 적용해서 페이지 사이즈만큼 뽑기
        List<Long> postIds = fetchPostIds(condition, pageable, sort);

        if (postIds.isEmpty()) {
            return new PageImpl<>(List.of(), pageable, 0);
        }

        // 전체 건수
        long total = countTotal(condition);

        // 2) 조인해서 이미지경로, 성별, 골격타입, 키, 몸무게, 작성시간 갖고오기 => List<PostSummaryRow>
        List<PostSummaryRow> rows = em.createQuery("""
                        select p.id,
                               sf.storagePath,
                               pr.gender,
                               pr.type,
                               pr.height,
                               pr.weight,
                               p.createdAt
                        from Post p
                        join p.user u
                        join u.profile pr
                        join p.storedFile sf
                        where p.id in :ids
                        """, PostSummaryRow.class)
                .setParameter("ids", postIds)
                .getResultList();

        // 3) postId -> styleList 매핑
        Map<Long, List<String>> stylesMap = fetchStylesMap(postIds);

        // postId -> PostSummaryRow로 매핑
        Map<Long, PostSummaryRow> rowMap = rows.stream()
                .collect(Collectors.toMap(PostSummaryRow::postId, r -> r));


        // 정렬된 id를 기준으로 다시 정렬 (IN은 순서보장X)
        List<PostSummary> content = postIds.stream()
                .map(id -> {
                    PostSummaryRow r = rowMap.get(id);
                    if (r == null) return null;

                    List<String> styles = stylesMap.getOrDefault(id, List.of());
                    boolean isLiked = false;

                    String imageUrl = r.storagePath();

                    return new PostSummary(
                            r.postId(),
                            imageUrl,
                            r.gender().name(),
                            r.skeletonType(),
                            styles,
                            r.height(),
                            r.weight(),
                            isLiked,
                            r.createdAt()
                    );
                })
                .filter(Objects::nonNull)
                .toList();

        return new PageImpl<>(content, pageable, total);
    }

    // postIds 갖고오기
    private List<Long> fetchPostIds(PostListSearchCondition command, Pageable pageable, String sort) {
        // 필터 조건들 => 문자열 처리
        String baseWhere = buildWhere(command);

        String orderBy = switch (sort) {
            case "popular" -> """
                    order by (select count(pl.id) from PostLike pl where pl.post.id = p.id) desc,
                             p.createdAt desc
                    """;
            default -> "order by p.createdAt desc";
        };

        // 필터 조건 적용
        String jpql = """
                select p.id
                from Post p
                join p.user u
                join u.profile pr
                """ + baseWhere + "\n" + orderBy;

        // 쿼리 생성, 파라미터 바인딩
        var query = em.createQuery(jpql, Long.class);
        applyParams(query, command);

        // 페이징 적용
        return query
                .setFirstResult((int) pageable.getOffset())
                .setMaxResults(pageable.getPageSize())
                .getResultList();
    }

    // 전체 개수
    private long countTotal(PostListSearchCondition command) {
        String jpql = """
                select count(p.id)
                from Post p
                join p.user u
                join u.profile pr
                """ + buildWhere(command);

        var query = em.createQuery(jpql, Long.class);
        applyParams(query, command);

        return query.getSingleResult();
    }

    // postId => 스타일 리스트
    private Map<Long, List<String>> fetchStylesMap(List<Long> postIds) {
        List<Object[]> styleRows = em.createQuery("""
                        select ps.post.id, s.styleName
                        from PostStyle ps
                        join ps.style s
                        where ps.post.id in :ids
                        """, Object[].class)
                .setParameter("ids", postIds)
                .getResultList();

        Map<Long, List<String>> map = new HashMap<>();
        for (Object[] r : styleRows) {
            Long postId = (Long) r[0];
            String styleName = (String) r[1];
            map.computeIfAbsent(postId, k -> new ArrayList<>()).add(styleName);
        }
        return map;
    }

    // Where문 빌드
    private String buildWhere(PostListSearchCondition command) {
        List<String> conditions = new ArrayList<>();
        // 항상 참인 조건 넣기 => and 붙이기 편하게 조건이 없을 수도 있음
        conditions.add("where 1=1");

        if (command.gender() != null) {
            conditions.add("and pr.gender = :gender");
        }

        if (command.minHeight() != null) {
            conditions.add("and pr.height >= :minHeight");
        }
        if (command.maxHeight() != null) {
            conditions.add("and pr.height <= :maxHeight");
        }
        if (command.minWeight() != null) {
            conditions.add("and pr.weight >= :minWeight");
        }
        if (command.maxWeight() != null) {
            conditions.add("and pr.weight <= :maxWeight");
        }

        if (command.style() != null && !command.style().isEmpty()) {
            conditions.add("""
                    and exists (
                        select 1
                        from PostStyle ps
                        join ps.style s
                        where ps.post.id = p.id
                          and s.styleName in :styles
                    )
                    """);
        }

        return "\n" + String.join("\n", conditions) + "\n";
    }

    // 파라미터에 바인딩
    private void applyParams(jakarta.persistence.Query query, PostListSearchCondition command) {
        if (command.gender() != null) {
            query.setParameter("gender", command.gender());
        }
        if (command.minHeight() != null) {
            query.setParameter("minHeight", command.minHeight());
        }
        if (command.maxHeight() != null) {
            query.setParameter("maxHeight", command.maxHeight());
        }
        if (command.minWeight() != null) {
            query.setParameter("minWeight", command.minWeight());
        }
        if (command.maxWeight() != null) {
            query.setParameter("maxWeight", command.maxWeight());
        }
        if (command.style() != null && !command.style().isEmpty()) {
            query.setParameter("styles", command.style());
        }
    }
}
