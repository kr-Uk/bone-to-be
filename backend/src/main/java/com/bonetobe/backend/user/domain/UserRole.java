package com.bonetobe.backend.user.domain;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum UserRole {
    USER("ROLE_USER"),
    ADMIN("ROLE_ADMIN"),
    OAUTH_USER("ROLE_OAUTH_USER");

    private final String key;
}