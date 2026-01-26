package com.bonetobe.backend.post.presentation.dto;

import com.bonetobe.backend.common.SkeletonType;
import com.bonetobe.backend.common.exception.BusinessException;
import com.bonetobe.backend.common.response.ErrorCode;
import com.bonetobe.backend.user.domain.Gender;
import com.bonetobe.backend.post.domain.PostSort;
import com.bonetobe.backend.post.domain.query.PostListQuery;
import com.bonetobe.backend.post.domain.query.PostSummary;
import com.bonetobe.backend.style.domain.StyleName;

import java.time.LocalDateTime;
import java.util.List;

public class PostListDto {

    public record Request(
            String sort,
            String gender,
            Integer minHeight,
            Integer maxHeight,
            Integer minWeight,
            Integer maxWeight,
            List<String> style
    ) {
        public PostListQuery toQuery() {
            validateRange(minHeight, maxHeight, minWeight, maxWeight);

            PostSort parsedPostSort = parseSort(sort);
            Gender parsedGender = parseGender(gender);
            List<StyleName> parsedStyles = parseStyles(style);

            return new PostListQuery(
                    parsedPostSort,
                    parsedGender,
                    minHeight,
                    maxHeight,
                    minWeight,
                    maxWeight,
                    parsedStyles
            );
        }

        private static void validateRange(
                Integer minHeight, Integer maxHeight,
                Integer minWeight, Integer maxWeight
        ) {
            if (minHeight != null && minHeight <= 0) throw new BusinessException(ErrorCode.POST_LIST_INVALID_RANGE);
            if (maxHeight != null && maxHeight <= 0) throw new BusinessException(ErrorCode.POST_LIST_INVALID_RANGE);
            if (minWeight != null && minWeight <= 0) throw new BusinessException(ErrorCode.POST_LIST_INVALID_RANGE);
            if (maxWeight != null && maxWeight <= 0) throw new BusinessException(ErrorCode.POST_LIST_INVALID_RANGE);

            if (minHeight != null && maxHeight != null && minHeight > maxHeight) {
                throw new BusinessException(ErrorCode.POST_LIST_INVALID_RANGE);
            }
            if (minWeight != null && maxWeight != null && minWeight > maxWeight) {
                throw new BusinessException(ErrorCode.POST_LIST_INVALID_RANGE);
            }
        }

        private static PostSort parseSort(String sort) {
            if (sort == null || sort.isBlank()) return PostSort.LATEST;

            String s = sort.trim().toUpperCase();
            return switch (s) {
                case "POPULAR" -> PostSort.POPULAR;
                case "LATEST" -> PostSort.LATEST;
                default -> throw new BusinessException(ErrorCode.POST_LIST_INVALID_SORT);
            };
        }

        private static Gender parseGender(String gender) {
            if (gender == null || gender.isBlank()) return null;

            String g = gender.trim().toUpperCase();
            return switch (g) {
                case "F", "FEMALE" -> Gender.FEMALE;
                case "M", "MALE" -> Gender.MALE;
                default -> throw new BusinessException(ErrorCode.POST_LIST_INVALID_GENDER);
            };
        }

        private static List<StyleName> parseStyles(List<String> styles) {
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
    }

    public record Response(
            Long postId,
            String imageUrl,
            Gender gender,
            SkeletonType skeletonType,
            List<StyleName> style,
            Integer height,
            Integer weight,
            Boolean isLiked,
            LocalDateTime createdAt
    ) {
        public static Response of(PostSummary summary) {
            return new Response(
                    summary.postId(),
                    summary.imageUrl(),
                    summary.gender(),
                    summary.skeletonType(),
                    summary.style(),
                    summary.height(),
                    summary.weight(),
                    summary.isLiked(),
                    summary.createdAt()
            );
        }
    }
}
