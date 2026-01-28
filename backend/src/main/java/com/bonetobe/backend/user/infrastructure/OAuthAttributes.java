package com.bonetobe.backend.user.infrastructure;

import com.bonetobe.backend.user.domain.OAuthProvider;
import com.bonetobe.backend.user.domain.OAuthUser;
import com.bonetobe.backend.user.domain.User;
import com.bonetobe.backend.user.domain.UserRole;
import lombok.Builder;
import lombok.Getter;
import java.util.Map;
import java.util.UUID;

@Getter
@Builder
public class OAuthAttributes {
    private Map<String, Object> attributes;
    private String nameAttributeKey;
    private String nickname;
    private String email;
    private String picture;
    private OAuthProvider provider;
    private String providerUserId;

    public static OAuthAttributes of(String registrationId, String userNameAttributeName, Map<String, Object> attributes) {
        if ("kakao".equals(registrationId)) {
            return ofKakao(userNameAttributeName, attributes);
        }
        if ("naver".equals(registrationId)) {
            return ofNaver("id", attributes);
        }
        return ofGoogle(userNameAttributeName, attributes);
    }

    private static OAuthAttributes ofGoogle(String userNameAttributeName, Map<String, Object> attributes) {
        return OAuthAttributes.builder()
                .nickname(sanitizeNickname((String) attributes.get("name"), "구글유저"))
                .email((String) attributes.get("email"))
                .picture((String) attributes.get("picture"))
                .provider(OAuthProvider.GOOGLE)
                .providerUserId((String) attributes.get(userNameAttributeName))
                .attributes(attributes)
                .nameAttributeKey(userNameAttributeName)
                .build();
    }

    private static OAuthAttributes ofKakao(String userNameAttributeName, Map<String, Object> attributes) {
        Map<String, Object> kakaoAccount = (Map<String, Object>) attributes.get("kakao_account");
        Map<String, Object> kakaoProfile = (kakaoAccount != null) ? (Map<String, Object>) kakaoAccount.get("profile") : null;

        String rawNickname = (kakaoProfile != null) ? (String) kakaoProfile.get("nickname") : null;
        String email = (kakaoAccount != null) ? (String) kakaoAccount.get("email") : null;

        if (email == null || email.isEmpty()) {
            email = attributes.get(userNameAttributeName) + "@kakao.com";
        }

        return OAuthAttributes.builder()
                .nickname(sanitizeNickname(rawNickname, "카카오유저"))
                .email(email)
                .picture(kakaoProfile != null ? (String) kakaoProfile.get("profile_image_url") : null)
                .provider(OAuthProvider.KAKAO)
                .providerUserId(String.valueOf(attributes.get(userNameAttributeName)))
                .attributes(attributes)
                .nameAttributeKey(userNameAttributeName)
                .build();
    }

    private static OAuthAttributes ofNaver(String userNameAttributeName, Map<String, Object> attributes) {
        Map<String, Object> response = (Map<String, Object>) attributes.get("response");
        String rawName = (String) response.get("name");

        if (rawName == null || rawName.isEmpty()) {
            rawName = (String) response.get("nickname");
        }

        return OAuthAttributes.builder()
                .nickname(sanitizeNickname(rawName, "네이버유저"))
                .email((String) response.get("email"))
                .picture((String) response.get("profile_image"))
                .attributes(response)
                .nameAttributeKey(userNameAttributeName)
                .provider(OAuthProvider.NAVER)
                .providerUserId((String) response.get("id"))
                .build();
    }

    // 닉네임 공통 필터링 로직 (한글, 영문, 숫자만 허용 및 공백 제거)
    private static String sanitizeNickname(String nickname, String defaultName) {
        if (nickname == null || nickname.isBlank()) {
            return defaultName;
        }

        // 1. 한글(완성형), 영문, 숫자 제외 모든 문자(공백 포함) 제거
        String sanitized = nickname.replaceAll("[^a-zA-Z0-9가-힣]", "");

        // 2. 제거 후 빈 문자열이 되었을 경우 방어
        if (sanitized.isEmpty()) {
            return defaultName;
        }

        // 3. 최대 10자 제한 (User 엔티티 제약조건 준수)
        return (sanitized.length() > 10) ? sanitized.substring(0, 10) : sanitized;
    }

    public OAuthUser toOAuthUserEntity(User user) {
        return OAuthUser.createOAuthUser(user, this.provider, this.providerUserId);
    }

    public User toEntity() {
        // 1. 추측 불가능한 랜덤 UUID 생성
        // 소셜 사용자는 이 패스워드를 알 필요가 없으며, 보안상 '채워두기' 용도입니다.
        String randomPassword = UUID.randomUUID().toString();

        return User.createUser(
                email,
                randomPassword, // 고정된 "OAUTH_USER" 대신 랜덤 값 사용
                nickname,
                UserRole.OAUTH_USER
        );
    }
}