package com.bonetobe.backend.user.infrastructure;

import com.bonetobe.backend.user.domain.OAuthProvider;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
public class KakaoOAuthAttributesMapper implements OAuthAttributesMapper {
    @Override
    public boolean supports(String registrationId) { return "kakao".equals(registrationId); }

    @Override
    public OAuthAttributes map(String userNameAttributeName, Map<String, Object> attributes) {
        Map<String, Object> kakaoAccount = (Map<String, Object>) attributes.get("kakao_account");
        Map<String, Object> kakaoProfile = (kakaoAccount != null) ? (Map<String, Object>) kakaoAccount.get("profile") : null;

        String rawNickname = (kakaoProfile != null) ? (String) kakaoProfile.get("nickname") : null;
        String email = (kakaoAccount != null) ? (String) kakaoAccount.get("email") : null;
        if (email == null || email.isEmpty()) {
            email = attributes.get(userNameAttributeName) + "@kakao.com";
        }

        return OAuthAttributes.builder()
                .nickname(OAuthAttributes.sanitizeNickname(rawNickname, "카카오유저"))
                .email(email)
                .picture(kakaoProfile != null ? (String) kakaoProfile.get("profile_image_url") : null)
                .provider(OAuthProvider.KAKAO)
                .providerUserId(String.valueOf(attributes.get(userNameAttributeName)))
                .attributes(attributes)
                .nameAttributeKey(userNameAttributeName)
                .build();
    }
}