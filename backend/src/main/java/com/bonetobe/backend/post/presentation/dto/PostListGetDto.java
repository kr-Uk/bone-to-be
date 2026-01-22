package com.bonetobe.backend.post.presentation.dto;

import com.bonetobe.backend.common.exception.BusinessException;
import com.bonetobe.backend.common.response.ErrorCode;
import com.bonetobe.backend.member.domain.Gender;
import com.bonetobe.backend.post.application.query.PostListSearchCondition;
import com.bonetobe.backend.style.domain.StyleName;

import java.util.List;
import java.util.Objects;

public class PostListGetDto {

    public record Request(
            String sort,
            String gender,
            Integer minHeight,
            Integer maxHeight,
            Integer minWeight,
            Integer maxWeight,
            List<String> style
    ) {
        public PostListSearchCondition toCondition() {
            Gender parsedGender = parseGender(gender);
            List<StyleName> parsedStyles = parseStyles(style);
            return new PostListSearchCondition(sort, parsedGender, minHeight, maxHeight, minWeight, maxWeight, parsedStyles);
        }

        private Gender parseGender(String gender) {
            if (gender == null) return null;
            String g = gender.trim();
            if (g.isBlank()) return null;

            return switch (g.toUpperCase()) {
                case "F" -> Gender.FEMALE;
                case "M" -> Gender.MALE;
                default -> throw new BusinessException(ErrorCode.POST_LIST_INVALID_GENDER);
            };
        }

        private List<StyleName> parseStyles(List<String> styles) {
            if (styles == null || styles.isEmpty()) return null;

            return styles.stream()
                    .filter(Objects::nonNull)
                    .map(String::trim)
                    .filter(s -> !s.isBlank())
                    .map(s -> {
                        try {
                            return StyleName.valueOf(s.toUpperCase());
                        } catch (IllegalArgumentException e) {
                            throw new BusinessException(ErrorCode.POST_LIST_INVALID_STYLE);
                        }
                    })
                    .toList();
        }

    }
}
