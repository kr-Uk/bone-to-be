package com.bonetobe.backend.user.domain;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface OAuthUserRepository extends JpaRepository<OAuthUser, Long> {
    // 소셜 서비스와 소셜 고유 ID로 연동된 계정을 찾습니다.
    Optional<OAuthUser> findByProviderAndProviderUserId(OAuthProvider provider, String providerUserId);
}