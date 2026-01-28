package com.bonetobe.backend.user.infrastructure;

import com.bonetobe.backend.user.domain.OAuthUser;
import com.bonetobe.backend.user.domain.OAuthUserRepository;
import com.bonetobe.backend.user.domain.User;
import com.bonetobe.backend.user.domain.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;

@Slf4j
@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;
    private final OAuthUserRepository oAuthUserRepository;

    @Override
    @Transactional
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);

        try {
            String registrationId = userRequest.getClientRegistration().getRegistrationId();
            String userNameAttributeName = userRequest.getClientRegistration()
                    .getProviderDetails().getUserInfoEndpoint().getUserNameAttributeName();

            OAuthAttributes attributes = OAuthAttributes.of(registrationId, userNameAttributeName, oAuth2User.getAttributes());

            User user = saveOrUpdate(attributes);

            return new UserPrincipal(
                    user.getId(),
                    user.getEmail(),
                    user.getPassword(), // UUID로 생성된 패스워드
                    Collections.singleton(new SimpleGrantedAuthority(user.getRole().getKey())), // Enum의 key 사용
                    attributes.getAttributes() // OAuth2User 인터페이스 구현을 위해 속성값 전달
            );

        } catch (Exception e) {
            log.error("OAuth2 Authentication Error: {}", e.getMessage());
            throw new OAuth2AuthenticationException(e.getMessage());
        }
    }

    private User saveOrUpdate(OAuthAttributes attributes) {
        return oAuthUserRepository.findByProviderAndProviderUserId(
                        attributes.getProvider(), attributes.getProviderUserId())
                .map(OAuthUser::getUser)
                .orElseGet(() -> {
                    // 이메일로 기존 유저 찾기
                    User user = userRepository.findByEmail(attributes.getEmail())
                            .orElseGet(() -> userRepository.save(attributes.toEntity()));

                    // 신규 소셜 연동 정보 저장
                    oAuthUserRepository.save(attributes.toOAuthUserEntity(user));
                    return user;
                });
    }
}