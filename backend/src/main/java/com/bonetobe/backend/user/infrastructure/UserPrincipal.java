package com.bonetobe.backend.user.infrastructure;

import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.Collection;
import java.util.Map;

@Getter
public class UserPrincipal implements UserDetails, OAuth2User {

    private final Long id; // 기존 userId를 id로 통일 (선택)
    private final String email;
    private final String password;
    private final Collection<? extends GrantedAuthority> authorities;
    private Map<String, Object> attributes; // 소셜 로그인 속성들

    // 1. 일반 로그인용 생성자 (인자 4개)
    public UserPrincipal(Long id, String email, String password, Collection<? extends GrantedAuthority> authorities) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.authorities = authorities;
    }

    // 2. 소셜 로그인용 생성자 (인자 5개) - CustomOAuth2UserService에서 사용
    public UserPrincipal(Long id, String email, String password, Collection<? extends GrantedAuthority> authorities, Map<String, Object> attributes) {
        this(id, email, password, authorities);
        this.attributes = attributes;
    }

    /**
     * OAuth2User 구현 메서드
     */
    @Override
    public Map<String, Object> getAttributes() {
        return attributes;
    }

    @Override
    public String getName() {
        return String.valueOf(id);
    }

    /**
     * UserDetails 구현 메서드
     */
    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override public boolean isAccountNonExpired() { return true; }
    @Override public boolean isAccountNonLocked() { return true; }
    @Override public boolean isCredentialsNonExpired() { return true; }
    @Override public boolean isEnabled() { return true; }
}