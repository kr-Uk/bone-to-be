package com.bonetobe.backend.user.domain;

import com.bonetobe.backend.common.exception.BusinessException;
import com.bonetobe.backend.common.response.ErrorCode;
import com.bonetobe.backend.file.domain.FileService;
import com.bonetobe.backend.file.presentation.FileDownloadUrl;
import com.bonetobe.backend.user.presentation.dto.FollowResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class FollowServiceImpl implements FollowService{

    private final FollowRepository followRepository;
    private final UserRepository userRepository;
    private final FileService fileService;

    @Override
    @Transactional
    public void follow(Long followingId, Long followerId) {
        // 1. 이미 팔로우 상태인지 확인 (중복 방지)
        if (followRepository.existsByFollowingIdAndFollowerId(followingId, followerId)) {
            throw new BusinessException(ErrorCode.ALREADY_FOLLOWING);
        }

        // 2. 대상 유저 존재 확인
        User following = userRepository.findById(followingId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));
        User follower = userRepository.findById(followerId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

        // 3. 정적 팩토리 메서드를 통한 생성 (내부에서 자기 자신 팔로우 검증 수행)
        Follow newFollow = Follow.createFollow(follower, following);

        followRepository.save(newFollow);
    }

    @Override
    @Transactional
    public void unfollow(Long followingId, Long followerId) {
        Follow follow = followRepository.findByFollowingIdAndFollowerId(followingId, followerId)
                .orElseThrow(() -> new BusinessException(ErrorCode.FOLLOW_NOT_FOUND));

        followRepository.delete(follow);
    }

    @Override
    public List<FollowResponse> getFollowings(Long userId, Long currentUserId) {
        return userRepository.findFollowingsByUserId(userId).stream()
                .map(user -> toFollowResponse(user, currentUserId))
                .toList();
    }

    @Override
    public List<FollowResponse> getFollowers(Long userId, Long currentUserId) {
        return userRepository.findFollowersByUserId(userId).stream()
                .map(user -> toFollowResponse(user, currentUserId))
                .toList();
    }

    private FollowResponse toFollowResponse(User user, Long currentUserId) {
        // 1. 팔로우 여부 체크
        boolean isFollowing = (currentUserId != null) &&
                followRepository.existsByFollowerIdAndFollowingId(currentUserId, user.getId());

        // 2. 프로필 이미지 URL 조회
        String profileImageUrl = null;
        if (user.getProfileImage() != null) {
            // FileServiceImpl의 getPublicDownloadUrls 호출
            List<FileDownloadUrl.Query> queries = List.of(new FileDownloadUrl.Query(user.getProfileImage().getId()));

            profileImageUrl = fileService.getPublicDownloadUrls(queries).stream()
                    .findFirst()
                    .map(FileDownloadUrl.Result::presignedUrl) // FileDownloadUrl.Result의 record/getter 확인 필요
                    .orElse(null);
        }

        return FollowResponse.of(user, profileImageUrl, isFollowing);
    }
}
