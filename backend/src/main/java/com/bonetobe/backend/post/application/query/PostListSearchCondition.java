package com.bonetobe.backend.post.application.query;

import com.bonetobe.backend.common.exception.BusinessException;
import com.bonetobe.backend.common.response.ErrorCode;
import com.bonetobe.backend.member.domain.Gender;
import com.bonetobe.backend.style.domain.StyleName;

import java.util.List;

public record PostListSearchCondition(
        String sort,
        Gender gender,
        Integer minHeight,
        Integer maxHeight,
        Integer minWeight,
        Integer maxWeight,
        List<StyleName> style
) {
    public String sortOrDefault() {
        if (sort == null) return "latest";

        String normalized = sort.trim().toLowerCase();

        if (normalized.isEmpty()) return "latest";

        if (!normalized.equals("latest") && !normalized.equals("popular")) {
            throw new BusinessException(ErrorCode.POST_LIST_INVALID_SORT);
        }

        return normalized;
    }

}
