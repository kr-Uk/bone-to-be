package com.bonetobe.backend.post.domain;

import com.bonetobe.backend.common.exception.BusinessException;
import com.bonetobe.backend.common.response.ErrorCode;
import com.bonetobe.backend.post.domain.query.PostLikeUserSummaryRaw;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Transactional
@Service
@RequiredArgsConstructor
public class PostLikeServiceImpl implements PostLikeService {

    private final PostLikeStore postLikeStore;
    private final PostLikeReader postLikeReader;

    @Override
    public void like(Long postId, Long userId) {
        int inserted = postLikeStore.insertLike(postId, userId);
        if (inserted == 0) {
            // 이미 좋아요 한 경우 등
            throw new BusinessException(ErrorCode.BAD_REQUEST);
        }

        int updated = postLikeStore.updatePostLikeCount(postId, +1);
        if (updated != 1) {
            // 게시물 없는 경우 등
            throw new BusinessException(ErrorCode.POST_NOT_FOUND);
        }
    }

    @Override
    public void unlike(Long postId, Long userId) {
        int deleted = postLikeStore.deleteLike(postId, userId);
        if (deleted == 0) {
            // 좋아요 안 했는데 취소
            throw new BusinessException(ErrorCode.BAD_REQUEST);
        }

        int updated = postLikeStore.updatePostLikeCount(postId, -1);
        if (updated != 1) {
            throw new BusinessException(ErrorCode.POST_LIST_INVALID_LIKE);
        }
    }

    @Transactional(readOnly = true)
    @Override
    public List<PostLikeUserSummaryRaw> getPostLikeUsers(Long postId, Long viewerId) {
        return postLikeReader.findPostLikeUsers(postId, viewerId);
    }
}
