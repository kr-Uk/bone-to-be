package com.bonetobe.backend.user.domain;

import com.bonetobe.backend.common.exception.BusinessException;
import com.bonetobe.backend.common.response.ErrorCode;
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
    public User signup(UserCreateCommand command) {
        // [1] 회원가입 프로세스 진입 로그
        log.info(">>>> [회원가입 프로세스 시작] 이메일: {}, 닉네임: {}", command.email(), command.nickname());

        try {
            // [2] 이메일 인증 번호 검증 단계
            validateEmailVerification(command.email(), command.authCode());
            log.info(">>>> [회원가입 검증 완료] 1. 이메일 인증 성공: {}", command.email());

            // [3] 중복 가입(이메일, 닉네임) 검증 단계
            validateDuplication(command.email(), command.nickname());
            log.info(">>>> [회원가입 검증 완료] 2. 중복 체크 통과: {}", command.email());

            // [4] 엔티티 생성 및 비밀번호 암호화
            log.info(">>>> [회원가입 엔티티 생성 중] 비밀번호 암호화 시작...");
            User user = User.createUser(
                    command.email(),
                    passwordEncoder.encode(command.password()),
                    command.nickname(),
                    "USER"
            );

            // [5] DB 최종 저장
            User savedUser = userRepository.save(user);
            log.info(">>>> [회원가입 최종 성공] DB ID: {}, 이메일: {}", savedUser.getId(), savedUser.getEmail());

            return savedUser;

        } catch (Exception e) {
            // 예외 발생 시 어떤 단계에서 문제가 생겼는지 추적하기 위한 에러 로그
            log.error("!!!! [회원가입 프로세스 실패] 이메일: {}, 이유: {}", command.email(), e.getMessage());
            throw e; // 발생한 예외는 그대로 다시 던져서 GlobalExceptionHandler가 처리하게 함
        }
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
        // isEmailVerified 대신 다시 '번호 대조' 방식인 verifyCode를 호출합니다.
        boolean isVerified = emailService.verifyCode(email, authCode);

        if (!isVerified) {
            throw new IllegalArgumentException("이메일 인증번호가 일치하지 않거나 만료되었습니다.");
        }
    }

    @Override
    @Transactional(readOnly = true)
    public void validateUserExists(String email) {
        // '존재하는지'만 체크하는 게 아니라 '활동 중인지'까지 체크해야 함
        if (!userRepository.existsActiveUserByEmail(email)) {
            throw new BusinessException(ErrorCode.USER_NOT_FOUND);
        }
    }

    @Override
    @Transactional
    public void updatePassword(String email, String newPassword) {
        User user = userRepository.findByEmail(email.trim())
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

        // 기존 비밀번호와 새 비밀번호가 같은지 확인 (선택 사항)
        if (passwordEncoder.matches(newPassword, user.getPassword())) {
            throw new BusinessException(ErrorCode.PASSWORD_SAME_AS_OLD); // 에러코드 추가 필요
        }

        user.updatePassword(passwordEncoder.encode(newPassword));
    }
}