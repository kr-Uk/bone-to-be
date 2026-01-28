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

        request.getSession(true);

        // 현재 요청이 들어온 Origin이나 Host를 확인하여 리다이렉트
        String host = request.getHeader("Host"); // 예: localhost:8080
        String targetUrl;

        if (host != null && host.contains("localhost")) {
            // 로컬 개발 환경 (프론트엔드 포트에 맞게)
            targetUrl = "http://localhost:5173";
        } else {
            // 실서비스 환경
            targetUrl = "https://bonetobe.site";
        }

        log.info("[OAuth2 Success] Redirecting to: {}", targetUrl);
        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }
}