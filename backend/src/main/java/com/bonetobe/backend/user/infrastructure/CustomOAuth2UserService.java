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
        // ㅡㅡ+ 이 로그가 찍히는지 안 찍히는지가 '필터 문제'인지 '로직 문제'인지 가르는 기준입니다!
        System.out.println("########## OAuth2 로직 진입 성공! ##########");
        log.error("########## OAuth2 로직 진입 성공! ##########");

        OAuth2User oAuth2User;
        try {
            oAuth2User = super.loadUser(userRequest);
            log.info(">>>> 카카오 데이터 수신 성공: {}", oAuth2User.getAttributes());
        } catch (Exception e) {
            log.error(">>>> [🚨FATAL ERROR] 카카오 서버 통신 실패: {}", e.getMessage());
            throw e;
        }

        try {
            String registrationId = userRequest.getClientRegistration().getRegistrationId();
            String userNameAttributeName = userRequest.getClientRegistration()
                    .getProviderDetails().getUserInfoEndpoint().getUserNameAttributeName();

            OAuthAttributes attributes = OAuthAttributes.of(registrationId, userNameAttributeName, oAuth2User.getAttributes());
            User user = saveOrUpdate(attributes);

            return new DefaultOAuth2User(
                    Collections.singleton(new SimpleGrantedAuthority(user.getRole())),
                    attributes.getAttributes(),
                    attributes.getNameAttributeKey()
            );
        } catch (Exception e) {
            // [핵심] 여기서 에러 로그를 콘솔에 강제로 도배합니다! ㅡㅡ+
            log.error(">>>> [🚨FATAL ERROR] 데이터 처리 중 폭발!!!");
            log.error(">>>> 에러 메시지: {}", e.getMessage());
            e.printStackTrace(); // 스택트레이스 전체 출력
            throw new OAuth2AuthenticationException(e.getMessage());
        }
    }

    // CustomOAuth2UserService.java 내부 수정
    private User saveOrUpdate(OAuthAttributes attributes) {
        // 1. 이미 소셜 연동(OAuthUser)이 되어 있는지 확인
        return oAuthUserRepository.findByProviderAndProviderUserId(
                        attributes.getProvider(), attributes.getProviderUserId())
                .map(OAuthUser::getUser)
                .orElseGet(() -> {
                    // 2. 소셜 연동은 없지만, 해당 이메일로 가입된 '일반 유저'가 있는지 확인
                    User user = userRepository.findByEmail(attributes.getEmail())
                            .orElseGet(() -> {
                                // 3. 둘 다 없다면 신규 가입 (save 결과를 변수에 명확히 담음)
                                return userRepository.save(attributes.toEntity());
                            });

                    // 4. 일반 유저는 있으나 소셜 연동이 안 된 경우, 연동 정보를 새로 생성
                    oAuthUserRepository.save(attributes.toOAuthUserEntity(user));
                    return user;
                });
    }
}