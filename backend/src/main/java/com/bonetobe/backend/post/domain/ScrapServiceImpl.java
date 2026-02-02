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
        // 게시글 없는 경우
        postReader.getById(postId);

        int inserted = scrapStore.insertScrap(postId, userId);
        if (inserted == 0) {
            // 이미 스크랩했거나 실패
            throw new BusinessException(ErrorCode.POST_ALREADY_SCRAPPED);
        }
    }

    @Override
    public void unscrap(Long postId, Long userId) {
        postReader.getById(postId);

        int deleted = scrapStore.deleteScrap(postId, userId);
        if (deleted == 0) {
            // 스크랩 안 했는데 취소
            throw new BusinessException(ErrorCode.POST_SCRAP_NOT_FOUND);
        }
    }
}
