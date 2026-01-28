package com.bonetobe.backend.user.infrastructure;

import com.bonetobe.backend.user.domain.OAuthProvider;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
public class GoogleOAuthAttributesMapper implements OAuthAttributesMapper {
    @Override
    public boolean supports(String registrationId) {
        return "google".equals(registrationId);
    }

    @Override
    public OAuthAttributes map(String userNameAttributeName, Map<String, Object> attributes) {
        return OAuthAttributes.builder()
                .nickname(OAuthAttributes.sanitizeNickname((String) attributes.get("name"), "구글유저"))
                .email((String) attributes.get("email"))
                .picture((String) attributes.get("picture"))
                .provider(OAuthProvider.GOOGLE)
                .providerUserId((String) attributes.get(userNameAttributeName))
                .attributes(attributes)
                .nameAttributeKey(userNameAttributeName)
                .build();
    }
}