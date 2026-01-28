package com.bonetobe.backend.user.infrastructure;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class OAuthAttributesFactory {

    private final List<OAuthAttributesMapper> mappers;

    public OAuthAttributes of(
            String registrationId,
            String userNameAttributeName,
            Map<String, Object> attributes
    ) {
        return mappers.stream()
                .filter(mapper -> mapper.supports(registrationId))
                .findFirst()
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Unsupported OAuth provider: " + registrationId
                        ))
                .map(userNameAttributeName, attributes);
    }
}
