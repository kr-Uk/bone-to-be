package com.bonetobe.backend.post.presentation.dto;

import com.bonetobe.backend.common.SkeletonType;
import com.bonetobe.backend.common.exception.BusinessException;
import com.bonetobe.backend.common.response.ErrorCode;
import com.bonetobe.backend.post.domain.PostSort;
import com.bonetobe.backend.post.domain.query.PostListQuery;
import com.bonetobe.backend.post.domain.query.PostSummary;
import com.bonetobe.backend.post.presentation.parser.PostRequestParser;
import com.bonetobe.backend.style.domain.StyleName;
import com.bonetobe.backend.user.domain.Gender;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDateTime;
import java.util.List;

public class PostListDto {
    @Schema(name = "PostListRequest")
    public record Request(
            String sort,
            String gender,
            String skeletonType,
            Integer minHeight,
            Integer maxHeight,
            Integer minWeight,
            Integer maxWeight,
            List<String> style
    ) {
        public PostListQuery toQuery(Long viewerId) {
            validateRange(minHeight, maxHeight, minWeight, maxWeight);

            PostSort parsedPostSort = parseSort(sort);
            Gender parsedGender = PostRequestParser.parseGender(gender);
            List<StyleName> parsedStyles = PostRequestParser.parseStyles(style);
            SkeletonType parsedSkeletonType = PostRequestParser.parseSkeletonType(skeletonType);

            return new PostListQuery(
                    viewerId,
                    parsedPostSort,
                    parsedGender,
                    parsedSkeletonType,
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
    }

    @Schema(name = "PostFileResponse")
    public record Response(
            Long postId,
            String imageUrl,
            String authorNickname,
            Gender gender,
            SkeletonType skeletonType,
            List<StyleName> style,
            Integer height,
            Integer weight,
            Boolean isLiked,
            Long commentCount,
            LocalDateTime createdAt
    ) {
        public static Response of(PostSummary summary) {
            return new Response(
                    summary.postId(),
                    summary.imageUrl(),
                    summary.authorNickname(),
                    summary.gender(),
                    summary.skeletonType(),
                    summary.style(),
                    summary.height(),
                    summary.weight(),
                    summary.isLiked(),
                    summary.commentCount(),
                    summary.createdAt()
            );
        }
    }
}
