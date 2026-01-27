package com.bonetobe.backend.user.infrastructure;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Slf4j
@Component
@RequiredArgsConstructor
public class OAuth2AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException {

        log.info(">>>> OAuth2 로그인 성공! 리다이렉트를 진행합니다.");

        // 세션 기반이므로 별도의 토큰 발급 없이 프론트엔드 메인 페이지로 보냅니다.
        String targetUrl = "https://bonetobe.site";

        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }
}