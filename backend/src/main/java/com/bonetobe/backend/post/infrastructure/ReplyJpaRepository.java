package com.bonetobe.backend.post.infrastructure;

import com.bonetobe.backend.post.domain.Reply;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ReplyJpaRepository extends JpaRepository<Reply, Long> {
    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("""
        UPDATE Reply r
        SET r.likeCount = r.likeCount + :delta
        WHERE r.id = :replyId
        AND (r.likeCount + :delta) >= 0
    """)
    int updateLikeCount(@Param("replyId") Long replyId, @Param("delta") long delta);

}
