package com.bonetobe.backend.user.domain;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void updatePassword(UserUpdateCommand command) {
        // command.validate(); // <- 생성자에서 이미 검증되었으므로 삭제 가능

        User user = userRepository.findById(command.userId())
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        // DB 데이터와 대조해야 하는 '비즈니스 검증'만 서비스에서 수행
        if (!passwordEncoder.matches(command.currentPassword(), user.getPassword())) {
            throw new IllegalArgumentException("현재 비밀번호가 일치하지 않습니다.");
        }

        user.updatePassword(passwordEncoder.encode(command.newPassword()));
    }

    @Override
    @Transactional
    public void deleteAccount(Long userId) {
        // 1. 유저 조회
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않거나 이미 탈퇴한 사용자입니다."));

        // 2. 삭제 실행
        user.deleteUser();

        log.info("[회원 탈퇴 완료] userId: {}", userId);
    }
}
