package com.bonetobe.backend.user.infrastructure;

import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final CustomUserDetailsService userService;
    private final CustomOAuth2UserService customOAuth2UserService;
    private final OAuth2AuthenticationSuccessHandler oAuth2AuthenticationSuccessHandler;

    // 패스워드 인코더로 사용할 빈 등록
    @Bean
    public PasswordEncoder passwordEncoder() { // 1. 인터페이스 타입으로 선언하고
        return new BCryptPasswordEncoder();    // 2. 실제 구현체인 BCrypt를 반환
    }

    // 필터 설정
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // 0. CORS 설정
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                // 1. CSRF 필터 disable (임시)
                .csrf(csrf -> csrf.disable())

                // 2. HTTP 요청에 대한 권한 설정
                .authorizeHttpRequests(auth -> auth
                        // 1. 게스트용 (None (Guest))
                        .requestMatchers(
                                "/auth/**",
                                "/api/auth/**",
                                "/swagger-ui/**",
                                "/v3/api-docs/**",
                                "/api/swagger-ui/**",
                                "/api/v3/api-docs/**",

                                // [수정] OAuth2 관련 모든 경로 및 기본 로그인/에러 경로 개방
                                "/oauth2/**",
                                "/login/**",           // 에러 페이지(/login?error) 대응
                                "/api/oauth2/**",
                                "/api/login/**"        // context-path 반영 에러 페이지 대응
                        ).permitAll()

                        // 2. 유저용 (User (Lv.1)) - 로그아웃 포함
                        .requestMatchers("/auth/logout").authenticated()

                        // 3. 나머지 모든 /users/me/** 요청들
                        .anyRequest().authenticated()
                )

                // 3. 폼 로그인 설정
                .formLogin(formLogin -> formLogin
                        .loginProcessingUrl("/auth/login") // 프론트에서 POST로 로그인을 요청할 주소
                        .usernameParameter("email") // 아이디 파라미터명 email
                        .passwordParameter("password")
                        .successHandler((request, response, authentication) -> {
                            response.setStatus(HttpServletResponse.SC_OK);
                            response.setContentType("application/json;charset=UTF-8");
                            response.getWriter().write("{\"message\": \"로그인 성공\"}");
                        })
                        .failureHandler((request, response, exception) -> {
                            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                            response.setContentType("application/json;charset=UTF-8");
                            response.getWriter().write("""
                                        {
                                          "code": 401,
                                          "message": "이메일 또는 비밀번호가 올바르지 않습니다."
                                        }
                                    """);
                         })
                        .permitAll()
                )

                // 6. 로그아웃 설정
                .logout(logout -> logout
                        .logoutUrl("/auth/logout")
                        .deleteCookies("JSESSIONID") // 로그아웃 시 쿠키 삭제
                        .logoutSuccessHandler((request, response, authentication) -> {
                            response.setStatus(HttpServletResponse.SC_OK);
                            response.setContentType("application/json;charset=UTF-8");
                            response.getWriter().write("{\"message\": \"로그아웃 성공\"}");
                        })
                        .invalidateHttpSession(true)
                )

                .oauth2Login(oauth2 -> oauth2
                        .userInfoEndpoint(userInfo -> userInfo.userService(customOAuth2UserService))
                        .successHandler(oAuth2AuthenticationSuccessHandler)
                        // [수정] 에러 발생 시 리다이렉트될 경로를 명시 (존재하는 경로로!)
                        .failureUrl("/auth/login?error")
                )

                .exceptionHandling(exception -> exception
                    .authenticationEntryPoint((request, response, authException) -> {
                        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                        response.setContentType("application/json;charset=UTF-8");
                        response.getWriter().write("{\"code\": 401, \"message\": \"인증이 필요합니다. (또는 잘못된 접근입니다.)\"}");
                    }));

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        configuration.addAllowedOrigin("https://bonetobe.site");
        configuration.addAllowedOrigin("http://localhost:5173");
        configuration.addAllowedOrigin("http://localhost:5174");

        configuration.addAllowedMethod("*"); // 모든 HTTP 메서드 허용 (GET, POST 등)
        configuration.addAllowedHeader("*"); // 모든 헤더 허용
        configuration.setAllowCredentials(true); // 쿠키/인증 정보를 포함한 요청 허용

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    // 인증 관리자 관련 설정
    @Bean
    public AuthenticationManager authenticationManager(HttpSecurity http,
                                                       PasswordEncoder passwordEncoder,
                                                       CustomUserDetailsService customUserDetailsService)
            throws Exception {
        // 1. 데이터베이스의 정보를 기반으로 인증을 처리하는 DaoAuthenticationProvider 생성
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();

        // 2. 사용자 세부 정보 서비스 설정 (DB에서 사용자 정보를 가져오는 역할)
        // 매개변수로 받은 userDetailService를 사용하여 DB와 연결
        authProvider.setUserDetailsService(customUserDetailsService);

        // 3. 비밀번호 검증을 위한 인코더 설정 (BCrypt 등을 사용하여 암호화된 비번 비교)
        authProvider.setPasswordEncoder(passwordEncoder);

        // 4. 설정된 Provider를 관리하는 ProviderManager를 생성하여 반환
        // 나중에 다른 인증 방식(예: OAuth2 등)을 추가할 때 Provider를 확장할 수 있음
        return new ProviderManager(authProvider);
    }

}
