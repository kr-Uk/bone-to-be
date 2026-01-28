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
        OAuth2User oAuth2User;

        try {
            // 소셜 서비스의 UserInfo 엔드포인트에서 실제 사용자 정보를 가져옴
            // 성공 시 이메일, 닉네임 등의 JSON 데이터 저장
            oAuth2User = super.loadUser(userRequest);
        } catch (Exception e) {
            throw e;
        }

        try {
            // 소셜 서비스의 고유 ID (kakao, google, naver)
            String registrationId = userRequest.getClientRegistration().getRegistrationId();
            // 소셜 서비스에서 사용자를 식별하기 위한 고유 식별자 (sub, id, response)
            String userNameAttributeName = userRequest.getClientRegistration()
                    .getProviderDetails().getUserInfoEndpoint().getUserNameAttributeName();

            // 소셜 서비스마다 다른 JSON 키 값을 하나로 묶어주는 어댑터
            OAuthAttributes attributes = OAuthAttributes.of(registrationId, userNameAttributeName, oAuth2User.getAttributes());
            // 데이터베이스 동기화 전략
            User user = saveOrUpdate(attributes);

            // 시큐리티 세션용 객체 생성 (권한, 데이터 담음)
            return new DefaultOAuth2User(
                    Collections.singleton(new SimpleGrantedAuthority(user.getRole())),
                    attributes.getAttributes(),
                    attributes.getNameAttributeKey()
            );
        } catch (Exception e) {
            e.printStackTrace();
            throw new OAuth2AuthenticationException(e.getMessage());
        }
    }

    private User saveOrUpdate(OAuthAttributes attributes) {
        // 1. 이미 소셜 연동(OAuthUser)이 되어 있는지 확인 (있으면 바로 User 반환)
        return oAuthUserRepository.findByProviderAndProviderUserId(
                        attributes.getProvider(), attributes.getProviderUserId())
                .map(OAuthUser::getUser)
                // 2. 소설 연동이 없는 경우
                .orElseGet(() -> {
                    // 2-1. 해당 이메일로 가입된 '일반 유저'가 있는지 확인
                    User user = userRepository.findByEmail(attributes.getEmail())
                            .orElseGet(() -> {
                                // 2-1-1. 소셜 연동, 이메일 둘다 없다면 신규 가입 (save 결과를 변수에 명확히 담음)
                                return userRepository.save(attributes.toEntity());
                            });
                    // 2-2. 일반 유저는 있으나 소셜 연동이 안 된 경우, 연동 정보를 새로 생성
                    oAuthUserRepository.save(attributes.toOAuthUserEntity(user));
                    return user;
                });
    }
}