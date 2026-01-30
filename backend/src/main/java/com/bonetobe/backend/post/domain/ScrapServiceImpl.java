package com.bonetobe.backend.post.domain;

import com.bonetobe.backend.common.exception.BusinessException;
import com.bonetobe.backend.common.response.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Transactional
@Service
@RequiredArgsConstructor
public class ScrapServiceImpl implements ScrapService {

    private final ScrapStore scrapStore;
    private final PostReader postReader;

    @Override
    public void scrap(Long postId, Long userId) {
        // 게시글 존재 확인 (좋아요보다 더 명확하게)
        postReader.getById(postId); // 없으면 POST_NOT_FOUND

        int inserted = scrapStore.insertScrap(postId, userId);
        if (inserted == 0) {
            // 이미 스크랩했거나 실패
            throw new BusinessException(ErrorCode.BAD_REQUEST);
        }
    }

    @Override
    public void unscrap(Long postId, Long userId) {
        int deleted = scrapStore.deleteScrap(postId, userId);
        if (deleted == 0) {
            // 스크랩 안 했는데 취소
            throw new BusinessException(ErrorCode.BAD_REQUEST);
        }
    }
}
