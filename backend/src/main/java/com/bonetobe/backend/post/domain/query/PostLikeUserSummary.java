package com.bonetobe.backend.post.domain.query;

public record PostLikeUserSummary (
        Long userId,
        String nickname,
        String profileImageUrl,
        Boolean isFollowing
){

}
