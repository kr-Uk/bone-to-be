package com.bonetobe.backend.user.presentation.dto;

import com.bonetobe.backend.user.domain.query.UserSearchSummary;

public class UserSearchDto {

    public record Response(
            Long userId,
            String nickname,
            String profileImageUrl,
            Boolean isFollowing
    ) {
        public static UserSearchDto.Response of(UserSearchSummary summary) {
            return new UserSearchDto.Response(
                    summary.userId(),
                    summary.nickname(),
                    summary.profileImageUrl(),
                    summary.isFollowing()
            );
        }
    }

}
