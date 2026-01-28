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
        // 1. 유저 조회
        User user = userRepository.findById(command.userId())
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        // 2. 비밀번호 일치 비교
        if (!passwordEncoder.matches(command.currentPassword(), user.getPassword())) {
            throw new IllegalArgumentException("현재 비밀번호가 일치하지 않습니다.");
        }

        // 3. 비밀번호 업데이트
        user.updatePassword(passwordEncoder.encode(command.newPassword()));
    }

    @Override
    @Transactional
    public void deleteAccount(Long userId) {
        // 1. 유저 조회
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않거나 이미 탈퇴한 사용자입니다."));

        // 2. 이미 삭제된 유저인지 체크
        if (user.getIsDeleted()) { // User 엔티티에 @Getter가 있다고 가정
            throw new IllegalStateException("이미 삭제된 계정입니다.");
        }

        // 3. 삭제 실행
        user.deleteUser();
        userRepository.update(user); // JPA 방식에 의존하지 않기 위해 코드 추가
        log.info("[회원 탈퇴 완료] userId: {}", userId);
    }

    @Override
    @Transactional
    public User getUserById(Long userId){
        return userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않거나 이미 탈퇴한 사용자입니다."));
    }
}
