package com.bonetobe.backend.user.infrastructure;

import com.bonetobe.backend.user.domain.User;
import com.bonetobe.backend.user.domain.UserRepository;
import com.bonetobe.backend.user.domain.UserRole; // Enum 임포트
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email)
            throws UsernameNotFoundException {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new UsernameNotFoundException("해당 이메일을 가진 사용자를 찾을 수 없습니다: " + email)
                );

        // [핵심 로직] Role이 OAUTH_USER인 경우 일반 로그인 차단
        // 소셜 유저는 패스워드가 랜덤 UUID라 어차피 알 수 없지만, 여기서 미리 차단하는 것이 보안상 더 깔끔합니다.
        if (user.getRole() == UserRole.OAUTH_USER) {
            throw new BadCredentialsException("소셜 로그인 계정입니다. 해당 소셜 서비스를 이용해 로그인해주세요.");
        }

        return new UserPrincipal(
                user.getId(),
                user.getEmail(),
                user.getNickname(),
                user.getPassword(),
                // user.getRole().getKey()는 "ROLE_USER" 또는 "ROLE_ADMIN" 등을 반환합니다.
                List.of(new SimpleGrantedAuthority(user.getRole().getKey()))
        );
    }
}