package com.bonetobe.backend.user.domain;

import com.bonetobe.backend.common.exception.BusinessException;
import com.bonetobe.backend.common.response.ErrorCode;
import com.bonetobe.backend.file.domain.FileService;
import com.bonetobe.backend.file.domain.StoredFile;
import com.bonetobe.backend.file.domain.StoredFileReader;
import com.bonetobe.backend.file.presentation.FileDownloadUrl;
import com.bonetobe.backend.file.presentation.FileUploadUrl;
import com.bonetobe.backend.post.domain.PostReader;
import com.bonetobe.backend.user.domain.command.UpdateMyPageCommand;
import com.bonetobe.backend.user.domain.command.UserFileCommand;
import com.bonetobe.backend.user.domain.command.UserUpdateCommand;
import com.bonetobe.backend.user.domain.query.UserFileSummary;
import com.bonetobe.backend.user.presentation.dto.UserDetailDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final FollowRepository followRepository;
    private final PasswordEncoder passwordEncoder;
    private final FileService fileService;
    private final PostReader postReader;
    private final StoredFileReader fileReader;

    @Transactional
    public UserFileSummary issueProfilePresignedUrl(UserFileCommand command) {
        FileUploadUrl.Request req = new FileUploadUrl.Request(
                command.originalFileName(),
                command.contentType(),
                command.fileSize()
        );

        FileUploadUrl.Response res = fileService.createUploadUrl(req, command.userId(), command.fileDomainCategory());

        return new UserFileSummary(
                res.fileId(),
                res.uploadUrl()
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
    public void updateMyPage(UpdateMyPageCommand command) {
        // 1. 유저 조회
        User user = userRepository.findById(command.userId())
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

        // 2. 닉네임 변경 시 중복 체크
        if (!user.getNickname().equals(command.nickname())) {
            if (userRepository.existsByNickname(command.nickname())) {
                throw new BusinessException(ErrorCode.DUPLICATE_NICKNAME);
            }
        }

        // 3. 프로필 이미지 조회
        StoredFile newProfileImage = user.getProfileImage();
        if (command.profileImageId() != null) {
            newProfileImage = fileReader.read(command.profileImageId()); // StoredFileReader 사용
        }

        // 4. 엔티티 업데이트 (더티 체킹)
        user.updateProfile(command.nickname(), command.bio(), newProfileImage);

        log.info("[마이페이지 수정 완료] userId: {}, nickname: {}", user.getId(), user.getNickname());
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

    @Override
    @Transactional(readOnly = true)
    public UserDetailDto getUserDetail(Long targetUserId) {
        User user = userRepository.findById(targetUserId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

        long postCount = postReader.countByUserId(targetUserId);
        long followerCount = followRepository.countByFollowingId(targetUserId);
        long followingCount = followRepository.countByFollowerId(targetUserId);

        String profileImageUrl = null;
        if (user.getProfileImage() != null) {
            List<FileDownloadUrl.Query> queries = Collections.singletonList(
                    new FileDownloadUrl.Query(user.getProfileImage().getId())
            );

            // .url()이나 .downloadUrl() 대신 .presignedUrl() 호출!
            var result = fileService.getPublicDownloadUrls(queries).get(0);
            profileImageUrl = result.presignedUrl();
        }

        return new UserDetailDto(
                profileImageUrl,
                user.getNickname(),
                user.getSkeletonType(),
                postCount,
                followerCount,
                followingCount,
                user.getBio()
        );
    }
}
