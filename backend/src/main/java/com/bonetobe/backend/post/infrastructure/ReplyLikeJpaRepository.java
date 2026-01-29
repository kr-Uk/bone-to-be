package com.bonetobe.backend.post.infrastructure;

import com.bonetobe.backend.post.domain.PostLike;
import com.bonetobe.backend.post.domain.ReplyLike;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ReplyLikeJpaRepository extends JpaRepository<ReplyLike, Long> {

    // 성공시 1 return, 중복이나 실패시 0 return
    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query(
            value = """
            INSERT INTO reply_like (reply_id, user_id)
            VALUES (:replyId, :userId)
            ON CONFLICT (reply_id, user_id) DO NOTHING
            """,
            nativeQuery = true
    )
    int insertLike(@Param("replyId") Long replyId, @Param("userId") Long userId);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query(
            value = """
            DELETE FROM reply_like
            WHERE reply_id = :replyId AND user_id = :userId
            """,
            nativeQuery = true
    )
    int deleteLike(@Param("replyId") Long replyId, @Param("userId") Long userId);
}
