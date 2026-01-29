package com.bonetobe.backend.post.presentation.dto;

import com.bonetobe.backend.post.domain.query.PostDetailSummary;
import com.bonetobe.backend.post.domain.query.PostLikeUserSummary;

public class PostLikeUserDto {
    public record Response(
            Long userId,
            String nickname,
            String profileImageUrl,
            Boolean isFollowing
    ) {
        public static PostLikeUserDto.Response of(PostLikeUserSummary summary) {
            return new PostLikeUserDto.Response(
                    summary.userId(),
                    summary.nickname(),
                    summary.profileImageUrl(),
                    summary.isFollowing()
            );
        }
    }

}
