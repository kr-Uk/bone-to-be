package com.bonetobe.backend.post.domain.query;

import com.bonetobe.backend.common.exception.BusinessException;
import com.bonetobe.backend.common.response.ErrorCode;
import com.bonetobe.backend.member.domain.Gender;
import com.bonetobe.backend.style.domain.StyleName;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;

import java.util.List;

public record PostListQuery(
        String sort,
        Gender gender,
        Integer minHeight,
        Integer maxHeight,
        Integer minWeight,
        Integer maxWeight,
        List<StyleName> style
) {
}
