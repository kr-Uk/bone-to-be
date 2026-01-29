package com.bonetobe.backend.post.infrastructure;

import com.bonetobe.backend.post.domain.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface PostJpaRepository extends JpaRepository<Post, Long> {
    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("""
        UPDATE Post p
        SET p.likeCount = p.likeCount + :delta
        WHERE p.id = :postId
        AND (p.likeCount + :delta) >= 0
    """)
    int updateLikeCount(@Param("postId") Long postId, @Param("delta") long delta);

    long countByUserId(Long userId);
}
