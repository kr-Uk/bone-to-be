package com.bonetobe.backend.user.domain;

import com.bonetobe.backend.user.infrastructure.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true) // 기본을 ReadOnly로 설정하여 성능 최적화
public class AuthServiceImpl implements AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    @Override
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    @Override
    public boolean existsByNickname(String nickname) {
        return userRepository.existsByNickname(nickname);
    }

    @Override
    @Transactional
    public User save(UserCreateCommand command) {
        log.info("[회원가입 시작] email: {}, nickname: {}", command.email(), command.nickname());

        // 1. 외부 시스템(Redis/DB) 의존 검증만 서비스에서 수행
        validateEmailVerification(command.email(), command.authCode());
        validateDuplication(command.email(), command.nickname());

        // 2. 엔티티 생성 (passwordEncoder를 사용하는 것은 서비스의 책임)
        User user = User.createUser(
                command.email(),
                passwordEncoder.encode(command.password()),
                command.nickname(),
                "USER"
        );

        User savedUser = userRepository.save(user);
        log.info("[회원가입 완료] 성공 ID: {}, email: {}", savedUser.getId(), savedUser.getEmail());

        return savedUser;
    }

    /**
     * 중복 가입 여부 통합 검증
     * 프록시 내부 호출 문제를 방지하기 위해 userRepository를 직접 호출하는 private 메서드 사용
     */
    private void validateDuplication(String email, String nickname) {
        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("이미 가입된 이메일입니다.");
        }
        if (userRepository.existsByNickname(nickname)) {
            throw new IllegalArgumentException("이미 사용 중인 닉네임입니다.");
        }
    }

    /**
     * 이메일 인증번호 검증 로직
     */
    private void validateEmailVerification(String email, String authCode) {
        boolean isVerified = emailService.verifyCode(email, authCode);
        if (!isVerified) {
            throw new IllegalArgumentException("이메일 인증번호가 일치하지 않거나 만료되었습니다.");
        }
    }
}