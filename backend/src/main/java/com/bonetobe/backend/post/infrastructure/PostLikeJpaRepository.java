package com.bonetobe.backend.post.infrastructure;

import com.bonetobe.backend.post.domain.PostLike;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface PostLikeJpaRepository extends JpaRepository<PostLike, Long> {

    // 성공시 1 return, 중복이나 실패시 0 return
    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query(
            value = """
            INSERT INTO post_like (post_id, user_id)
            VALUES (:postId, :userId)
            ON CONFLICT (post_id, user_id) DO NOTHING
            """,
            nativeQuery = true
    )
    int insertLike(@Param("postId") Long postId, @Param("userId") Long userId);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query(
            value = """
            DELETE FROM post_like
            WHERE post_id = :postId AND user_id = :userId
            """,
            nativeQuery = true
    )
    int deleteLike(@Param("postId") Long postId, @Param("userId") Long userId);
}
