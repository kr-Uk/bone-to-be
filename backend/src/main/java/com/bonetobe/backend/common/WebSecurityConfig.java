package com.bonetobe.backend.common;

import com.bonetobe.backend.user.domain.UserDetailService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.autoconfigure.security.servlet.PathRequest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class WebSecurityConfig {

    private final UserDetailService userService;

    // 스프링 시큐리티 일부 기능 비활성화
    @Bean
    public WebSecurityCustomizer configure() {
        return (web) -> web.ignoring()
                // 스프링 부트가 제공하는 기본 정적 리소스 위치를 모두 무시
                .requestMatchers(PathRequest.toStaticResources().atCommonLocations())
                // H2 콘솔 경로 무시 (PathRequest 사용 권장)
                .requestMatchers(PathRequest.toH2Console());
    }

    // 패스워드 인코더로 사용할 빈 등록
    @Bean
    public PasswordEncoder passwordEncoder() { // 1. 인터페이스 타입으로 선언하고
        return new BCryptPasswordEncoder();    // 2. 실제 구현체인 BCrypt를 반환
    }

    // 필터 설정
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // 1. CSRF 필터 disable (임시)
                .csrf(csrf -> csrf.disable())

                // 2. HTTP 요청에 대한 권한 설정
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                "/auth/**",
                                "/swagger-ui/**",
                                "/v3/api-docs/**",
                                "/swagger-resources/**",
                                "/webjars/**"
                        ).permitAll()
                        .anyRequest().authenticated() // 그 외 모든 요청은 인증 필요
                )

                // 3. 폼 로그인 설정
                .formLogin(formLogin -> formLogin
                        .loginProcessingUrl("/auth/login") // 프론트에서 POST로 로그인을 요청할 주소
                        .successHandler((request, response, authentication) -> {
                            response.setStatus(HttpServletResponse.SC_OK);
                            response.setContentType("application/json;charset=UTF-8");
                            response.getWriter().write("{\"message\": \"로그인 성공\"}");
                        })
                        .failureHandler((request, response, exception) -> {
                            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                            response.setContentType("application/json;charset=UTF-8");
                            response.getWriter().write("{\"message\": \"로그인 실패: " + exception.getMessage() + "\"}");
                        })
                        .permitAll()
                )

                // 6. 로그아웃 설정
                .logout(logout -> logout
                        .logoutUrl("/auth/logout")
                        .logoutSuccessHandler((request, response, authentication) -> {
                            response.setStatus(HttpServletResponse.SC_OK);
                            response.setContentType("application/json;charset=UTF-8");
                            response.getWriter().write("{\"message\": \"로그아웃 성공\"}");
                        })
                        .invalidateHttpSession(true)
                )

                .exceptionHandling(exception -> exception
                    .authenticationEntryPoint((request, response, authException) -> {
                        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                        response.setContentType("application/json;charset=UTF-8");
                        response.getWriter().write("{\"code\": 401, \"message\": \"인증이 필요합니다. (또는 잘못된 접근입니다.)\"}");
                    }));

        return http.build();
    }

    // 인증 관리자 관련 설정
    @Bean
    public AuthenticationManager authenticationManager(HttpSecurity http,
                                                       PasswordEncoder passwordEncoder,
                                                       UserDetailService userDetailService)
            throws Exception {
        // 1. 데이터베이스의 정보를 기반으로 인증을 처리하는 DaoAuthenticationProvider 생성
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();

        // 2. 사용자 세부 정보 서비스 설정 (DB에서 사용자 정보를 가져오는 역할)
        // 매개변수로 받은 userDetailService를 사용하여 DB와 연결
        authProvider.setUserDetailsService(userService);

        // 3. 비밀번호 검증을 위한 인코더 설정 (BCrypt 등을 사용하여 암호화된 비번 비교)
        authProvider.setPasswordEncoder(passwordEncoder);

        // 4. 설정된 Provider를 관리하는 ProviderManager를 생성하여 반환
        // 나중에 다른 인증 방식(예: OAuth2 등)을 추가할 때 Provider를 확장할 수 있음
        return new ProviderManager(authProvider);
    }

}
