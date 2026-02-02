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
    private final PostReader postReader;

    @Override
    public void like(Long postId, Long userId) {

        // 게시글 존재 여부 확인
        postReader.getById(postId);

        int inserted = postLikeStore.insertLike(postId, userId);
        // 이미 좋아요를 한 경우
        if (inserted == 0) {
            throw new BusinessException(ErrorCode.POST_ALREADY_LIKED);
        }

        postLikeStore.updatePostLikeCount(postId, +1);
    }


    @Override
    public void unlike(Long postId, Long userId) {

        // 게시글 존재 여부 확인
        postReader.getById(postId);

        int deleted = postLikeStore.deleteLike(postId, userId);
        // 좋아요를 한 적이 없음
        if (deleted == 0) {
            throw new BusinessException(ErrorCode.POST_LIKE_NOT_FOUND);
        }

        postLikeStore.updatePostLikeCount(postId, -1);
    }


    @Transactional(readOnly = true)
    @Override
    public List<PostLikeUserSummaryRaw> getPostLikeUsers(Long postId, Long viewerId) {
        if (postReader.getById(postId) == null){
            throw new BusinessException(ErrorCode.BAD_REQUEST);
        }
        return postLikeReader.findPostLikeUsers(postId, viewerId);
    }
}
