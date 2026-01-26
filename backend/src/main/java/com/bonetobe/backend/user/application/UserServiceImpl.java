package com.bonetobe.backend.user.application;

import com.bonetobe.backend.common.S3Properties;
import com.bonetobe.backend.file.domain.FileService;
import com.bonetobe.backend.file.presentation.FileUploadUrl;
import com.bonetobe.backend.user.domain.User;
import com.bonetobe.backend.user.domain.UserRepository;
import com.bonetobe.backend.user.domain.UserUpdateCommand;
import com.bonetobe.backend.user.presentation.UpdateUser;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.PresignedPutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.model.PutObjectPresignRequest;

import java.time.Duration;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    private final FileService fileService;

    @Override
    @Transactional
    public void updateInfo(Long userId, UpdateUser.InfoRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        user.updateProfile(
                request.getNickname(),
                request.getProfileImage()
        );
    }

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
}
