package com.bonetobe.backend.post.domain.query;

import com.bonetobe.backend.member.domain.Gender;
import com.bonetobe.backend.post.domain.PostSort;
import com.bonetobe.backend.style.domain.StyleName;

import java.util.List;

public record PostListQuery(
        PostSort postSort,
        Gender gender,
        Integer minHeight,
        Integer maxHeight,
        Integer minWeight,
        Integer maxWeight,
        List<StyleName> style
) {
}
