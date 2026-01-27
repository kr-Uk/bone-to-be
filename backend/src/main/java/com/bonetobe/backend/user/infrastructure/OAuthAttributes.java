package com.bonetobe.backend.user.infrastructure;

import com.bonetobe.backend.user.domain.OAuthProvider; // 추가
import com.bonetobe.backend.user.domain.OAuthUser;
import com.bonetobe.backend.user.domain.User;
import lombok.Builder;
import lombok.Getter;
import java.util.Map;

@Getter
@Builder
public class OAuthAttributes {
    private Map<String, Object> attributes;
    private String nameAttributeKey;
    private String name;
    private String email;
    private OAuthProvider provider; // 추가: GOOGLE, KAKAO 등
    private String providerUserId;  // 추가: 소셜 서비스의 고유 ID

    public static OAuthAttributes of(String registrationId, String userNameAttributeName, Map<String, Object> attributes) {
        if ("kakao".equals(registrationId)) {
            return ofKakao(userNameAttributeName, attributes);
        }
        return ofGoogle(userNameAttributeName, attributes);
    }

    private static OAuthAttributes ofGoogle(String userNameAttributeName, Map<String, Object> attributes) {
        return OAuthAttributes.builder()
                .name((String) attributes.get("name"))
                .email((String) attributes.get("email"))
                .provider(OAuthProvider.GOOGLE) // 추가
                .providerUserId((String) attributes.get(userNameAttributeName)) // 추가
                .attributes(attributes)
                .nameAttributeKey(userNameAttributeName)
                .build();
    }

    private static OAuthAttributes ofKakao(String userNameAttributeName, Map<String, Object> attributes) {
        // 1. 계정 정보와 프로필 정보를 단계별로 안전하게 추출
        Map<String, Object> kakaoAccount = (Map<String, Object>) attributes.get("kakao_account");
        Map<String, Object> kakaoProfile = (kakaoAccount != null) ? (Map<String, Object>) kakaoAccount.get("profile") : null;

        // 2. 닉네임 방어 (null일 경우 '카카오유저'로 대체)
        String name = "카카오유저";
        if (kakaoProfile != null && kakaoProfile.get("nickname") != null) {
            name = (String) kakaoProfile.get("nickname");
        }

        // 3. 이메일 방어 (동의 항목을 켰더라도 이전 가입자 등을 위해 고유 ID로 대체 로직 유지)
        String email = (kakaoAccount != null) ? (String) kakaoAccount.get("email") : null;
        if (email == null || email.isEmpty()) {
            email = attributes.get(userNameAttributeName) + "@kakao.com";
        }

        return OAuthAttributes.builder()
                .name(name)
                .email(email)
                .provider(OAuthProvider.KAKAO)
                // [핵심] 카카오 ID는 숫자(Long)이므로 반드시 String.valueOf를 써야 500 에러가 안 납니다!
                .providerUserId(String.valueOf(attributes.get(userNameAttributeName)))
                .attributes(attributes)
                .nameAttributeKey(userNameAttributeName)
                .build();
    }

    public OAuthUser toOAuthUserEntity(User user) {
        return OAuthUser.createOAuthUser(user, this.provider, this.providerUserId);
    }

    public User toEntity() {
        return User.createUser(
                email,
                "OAUTH_USER", // password가 nullable=false이므로 더미값 필요
                name,
                "USER"
        );
    }
}