package com.bonetobe.backend.post.application;

import com.bonetobe.backend.common.exception.BusinessException;
import com.bonetobe.backend.common.response.ErrorCode;
import com.bonetobe.backend.post.application.query.PostListSearchCondition;
import com.bonetobe.backend.post.application.query.PostReader;
import com.bonetobe.backend.post.application.query.PostSummary;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class PostFacade {

    private final PostReader postReader;

    public Page<PostSummary> getPostList(PostListSearchCondition condition, Pageable pageable) {
        validatePaging(pageable);

        return postReader.findPostList(condition, pageable);
    }

    private void validatePaging(Pageable pageable) {
        if (pageable == null ||
                pageable.getPageNumber() < 0 ||
                pageable.getPageSize() <= 0 ||
                pageable.getPageSize() > 50) {
            throw new BusinessException(ErrorCode.POST_LIST_INVALID_PAGING);
        }
    }
}

