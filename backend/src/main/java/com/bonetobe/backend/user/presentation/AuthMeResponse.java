package com.bonetobe.backend.user.presentation;

import com.bonetobe.backend.user.infrastructure.UserPrincipal;
import lombok.Builder;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;

@Getter
@Builder
public class AuthMeResponse {
    private String email;
    private String nickname;
    private String role;

    public static AuthMeResponse from(UserPrincipal principal) {
        return AuthMeResponse.builder()
                .email(principal.getEmail())
                .nickname(principal.getNickname())
                .role(principal.getAuthorities().stream()
                        .map(GrantedAuthority::getAuthority)
                        .findFirst().orElse("ROLE_USER"))
                .build();
    }
}