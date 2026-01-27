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
        log.info(">>>> [회원가입 시작] 이메일: {}", command.email());

        // 1. Redis 인증 상태 확인 (완료 마크가 있는지)
        validateEmailVerificationStatus(command.email());

        // 2. 중복 검증 (BusinessException으로 통일)
        validateDuplication(command.email(), command.nickname());

        // 3. 생성 및 저장
        User user = User.createUser(
                command.email(),
                passwordEncoder.encode(command.password()),
                command.nickname(),
                "USER"
        );
        User savedUser = userRepository.save(user);

        // 4. 뒷정리: Redis 인증 완료 마크 삭제
        emailService.deleteAuthStatus(command.email());

        return savedUser;
    }

    /**
     * Redis에 저장된 이메일 인증 성공 여부 확인
     */
    private void validateEmailVerificationStatus(String email) {
        // EmailService의 isEmailVerified를 호출하여 "true" 상태인지 확인합니다.
        if (!emailService.isEmailVerified(email)) {
            // 적절한 에러 코드로 예외를 던집니다. (예: 인증되지 않은 이메일)
            throw new BusinessException(ErrorCode.EMAIL_NOT_VERIFIED);
        }
    }

    /**
     * 중복 가입 여부 통합 검증
     * 프록시 내부 호출 문제를 방지하기 위해 userRepository를 직접 호출하는 private 메서드 사용
     */
    private void validateDuplication(String email, String nickname) {
        if (userRepository.existsByEmail(email)) {
            throw new BusinessException(ErrorCode.DUPLICATE_EMAIL); // 이메일 중복 에러코드 활용
        }
        if (userRepository.existsByNickname(nickname)) {
            throw new BusinessException(ErrorCode.DUPLICATE_NICKNAME); // 닉네임 중복 에러코드 활용
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