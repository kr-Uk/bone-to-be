package com.bonetobe.backend.post.infrastructure;

import com.bonetobe.backend.post.domain.Scrap;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ScrapJpaRepository extends JpaRepository<Scrap, Long> {

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query(
            value = """
            INSERT INTO scrap (post_id, user_id)
            VALUES (:postId, :userId)
            ON CONFLICT (post_id, user_id) DO NOTHING
            """,
            nativeQuery = true
    )
    int insertScrap(@Param("postId") Long postId, @Param("userId") Long userId);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query(
            value = """
            DELETE FROM scrap
            WHERE post_id = :postId AND user_id = :userId
            """,
            nativeQuery = true
    )
    int deleteScrap(@Param("postId") Long postId, @Param("userId") Long userId);
}
