package com.bonetobe.backend.user.infrastructure;

import com.bonetobe.backend.user.domain.OAuthProvider;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
public class NaverOAuthAttributesMapper implements OAuthAttributesMapper{
    @Override
    public boolean supports(String registrationId) {
        return "naver".equals(registrationId);
    }

    @Override
    public OAuthAttributes map(String userNameAttributeName, Map<String, Object> attributes) {
        Map<String, Object> response = (Map<String, Object>) attributes.get("response");
        String rawName = (String) response.get("name");

        if (rawName == null || rawName.isEmpty()) {
            rawName = (String) response.get("nickname");
        }

        return OAuthAttributes.builder()
                .nickname(OAuthAttributes.sanitizeNickname(rawName, "네이버유저"))
                .email((String) response.get("email"))
                .picture((String) response.get("profile_image"))
                .attributes(response)
                .nameAttributeKey(userNameAttributeName)
                .provider(OAuthProvider.NAVER)
                .providerUserId((String) response.get("id"))
                .build();
    }
}
