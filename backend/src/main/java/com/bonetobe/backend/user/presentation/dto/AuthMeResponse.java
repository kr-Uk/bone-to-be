package com.bonetobe.backend.user.presentation.dto;

import com.bonetobe.backend.user.infrastructure.UserPrincipal;
import lombok.Builder;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;

@Getter
@Builder
public class AuthMeResponse {
    private Long userId;
    private String email;
    private String nickname;
    private String role;
    private String profileImageUrl;

    public static AuthMeResponse from(UserPrincipal principal, String imageUrl) {
        return AuthMeResponse.builder()
                .userId(principal.getId())
                .email(principal.getEmail())
                .nickname(principal.getNickname())
                .role(principal.getAuthorities().stream()
                        .map(GrantedAuthority::getAuthority)
                        .findFirst().orElse("ROLE_USER"))
                .profileImageUrl(imageUrl)
                .build();
    }
}