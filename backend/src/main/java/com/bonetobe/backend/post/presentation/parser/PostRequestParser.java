package com.bonetobe.backend.post.presentation.parser;

import com.bonetobe.backend.common.SkeletonType;
import com.bonetobe.backend.common.exception.BusinessException;
import com.bonetobe.backend.common.response.ErrorCode;
import com.bonetobe.backend.style.domain.StyleName;
import com.bonetobe.backend.user.domain.Gender;

import java.util.List;

public class PostRequestParser {
    public static Gender parseGender(String gender) {
        if (gender == null || gender.isBlank()) return null;

        String g = gender.trim().toUpperCase();
        return switch (g) {
            case "F", "FEMALE" -> Gender.FEMALE;
            case "M", "MALE" -> Gender.MALE;
            default -> throw new BusinessException(ErrorCode.POST_LIST_INVALID_GENDER);
        };
    }

    public static List<StyleName> parseStyles(List<String> styles) {
        if (styles == null || styles.isEmpty()) return null;

        try {
            return styles.stream()
                    .filter(s -> s != null && !s.isBlank())
                    .map(s -> s.trim().toUpperCase())
                    .map(StyleName::valueOf)
                    .toList();
        } catch (IllegalArgumentException e) {
            throw new BusinessException(ErrorCode.POST_LIST_INVALID_STYLE);
        }
    }

    public static SkeletonType parseSkeletonType(String skeletonType) {
        if (skeletonType == null || skeletonType.isBlank()) return null;

        String s = skeletonType.trim().toUpperCase();
        try {
            return SkeletonType.valueOf(s);
        } catch (IllegalArgumentException e) {
            throw new BusinessException(ErrorCode.POST_LIST_INVALID_SKELETON_TYPE);
        }
    }
}
