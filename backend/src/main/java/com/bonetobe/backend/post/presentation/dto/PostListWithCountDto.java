package com.bonetobe.backend.post.presentation.dto;

import com.bonetobe.backend.post.domain.query.PostSummary;

import java.util.List;

public class PostListWithCountDto {
    public record Response(
            Long totalCount,
            List<PostListDto.Response> content
            ) {
        public static PostListWithCountDto.Response of(List<PostListDto.Response> postList) {
            return new PostListWithCountDto.Response(
                    (long) postList.size(),
                    postList
            );
        }
    }
}
