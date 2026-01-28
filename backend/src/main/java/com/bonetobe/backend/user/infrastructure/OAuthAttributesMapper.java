package com.bonetobe.backend.user.infrastructure;

import java.util.Map;

public interface OAuthAttributesMapper {

    boolean supports(String registrationId);

    OAuthAttributes map(
            String userNameAttributeName,
            Map<String, Object> attributes
    );
}
