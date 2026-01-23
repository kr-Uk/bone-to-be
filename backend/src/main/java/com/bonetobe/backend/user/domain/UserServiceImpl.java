package com.bonetobe.backend.user.domain;

import com.bonetobe.backend.user.infrastructure.UserRepository;
import com.bonetobe.backend.user.presentation.AddUser;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true) // 기본을 ReadOnly로 설정하여 성능 최적화
public class UserServiceImpl implements UserService {
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
    @Transactional // 쓰기 작업에만 별도의 트랜잭션 선언
    public AddUser.Response save(UserCreateCommand command) {
        // 1. 비밀번호 일치 검사
        command.validate();

        // 2. 이메일 인증 여부 최종 검증 (Redis 확인)
        validateEmailVerification(command.email(), command.authCode());

        // 3. 중복 조회를 별도 private 메서드로 분리 (트랜잭션 전파 명확화)
        validateDuplication(command.email(), command.nickname());

        // 4. 엔티티 생성 및 저장
        User user = User.createUser(
                command.email(),
                passwordEncoder.encode(command.password()),
                command.nickname()
        );

        User savedUser = userRepository.save(user);
        return AddUser.Response.from(savedUser);
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