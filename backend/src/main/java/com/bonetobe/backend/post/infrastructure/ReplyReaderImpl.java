package com.bonetobe.backend.post.infrastructure;

import com.bonetobe.backend.common.exception.BusinessException;
import com.bonetobe.backend.common.response.ErrorCode;
import com.bonetobe.backend.post.domain.Post;
import com.bonetobe.backend.post.domain.Reply;
import com.bonetobe.backend.post.domain.ReplyReader;
import com.bonetobe.backend.post.domain.query.ReplySummaryRaw;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
@RequiredArgsConstructor
public class ReplyReaderImpl implements ReplyReader {

    private final ReplyQueryDslRepository replyQueryDslRepository;
    private final ReplyJpaRepository replyJpaRepository;

    @Override
    public List<ReplySummaryRaw> findReplyList(Long postId, Long viewerId){
        return replyQueryDslRepository.findReplyList(postId, viewerId);
    }

    @Override
    public Reply getById(Long replyId) {
        return replyJpaRepository.findById(replyId)
                .orElseThrow(() -> new BusinessException(ErrorCode.POST_NOT_FOUND));
    }
}
