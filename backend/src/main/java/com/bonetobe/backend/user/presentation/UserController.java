package com.bonetobe.backend.user.presentation;

import com.bonetobe.backend.common.exception.BusinessException;
import com.bonetobe.backend.common.response.APIResponse;
import com.bonetobe.backend.common.response.ErrorCode;
import com.bonetobe.backend.common.response.SuccessCode;
import com.bonetobe.backend.report.domain.ReportService;
import com.bonetobe.backend.report.presentation.dto.GetReport;
import com.bonetobe.backend.user.application.UserFacade;
import com.bonetobe.backend.user.domain.UserService;
import com.bonetobe.backend.user.domain.query.UserFileSummary;
import com.bonetobe.backend.user.domain.query.UserSearchSummary;
import com.bonetobe.backend.user.infrastructure.UserPrincipal;
import com.bonetobe.backend.user.presentation.dto.UpdateUser;
import com.bonetobe.backend.user.presentation.dto.UserDetailDto;
import com.bonetobe.backend.user.presentation.dto.UserFileDto;
import com.bonetobe.backend.user.presentation.dto.UserSearchDto;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@SecurityRequirement(name = "CookieAuth")
@RequestMapping("/users")
public class UserController {
    private final UserService userService;
    private final UserFacade userFacade;
    private final ReportService reportService;

    /**
     * 마이페이지 기본 정보 조회
     * GET /users/me
     */
    @GetMapping("/me")
    public ResponseEntity<APIResponse<UserDetailDto>> getMyPageInfo(
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        if (principal == null) {
            throw new BusinessException(ErrorCode.UNAUTHORIZED);
        }

        // 로그인한 사용자의 ID로 정보 조회
        UserDetailDto response = userService.getUserDetail(principal.getId(), principal.getId());

        return ResponseEntity
                .status(SuccessCode.OK.getStatus())
                .body(APIResponse.success(SuccessCode.OK, response));
    }

    /**
     * 타인 프로필 조회
     * GET /users/{userId}
     */
    @GetMapping("/{userId}")
    public ResponseEntity<APIResponse<UserDetailDto>> getUserDetail(
            @PathVariable Long userId,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        if (principal == null) {
            throw new BusinessException(ErrorCode.UNAUTHORIZED);
        }

        Long currentUserId = principal.getId();

        // 특정 유저의 ID로 정보 조회
        UserDetailDto response = userService.getUserDetail(userId, currentUserId);

        return ResponseEntity
                .status(SuccessCode.OK.getStatus())
                .body(APIResponse.success(SuccessCode.OK, response));
    }

    @PutMapping("/me")
    public ResponseEntity<APIResponse<Void>> updateMyPage(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestBody @Valid UpdateUser.Request request
    ) {
        if (principal == null) {
            throw new BusinessException(ErrorCode.UNAUTHORIZED);
        }

        userService.updateMyPage(request.toCommand(principal.getId()));

        return ResponseEntity.ok(APIResponse.success(SuccessCode.OK));
    }

    // 프로필 이미지 업로드
    @PostMapping("/me/profile-image/presigned-url")
    public ResponseEntity<APIResponse<UserFileDto.Response>> issueProfilePresignedUrl(
            @RequestBody UserFileDto.Request request,
            @AuthenticationPrincipal UserPrincipal user
    ) {
        // 앞서 작성한 인증 예외 처리가 여기서 적용됨
        if (user == null) {
            throw new BusinessException(ErrorCode.UNAUTHORIZED);
        }

        UserFileSummary summary = userService.issueProfilePresignedUrl(request.toCommand(user.getId()));
        return ResponseEntity
                .ok(APIResponse
                        .success(SuccessCode.OK,
                                UserFileDto.Response.of(summary)));
    }

    // 마이페이지 수정
    //@PutMapping("/me")

    @PatchMapping("/me/password")
    public ResponseEntity<APIResponse<Void>> updatePassword(
            @AuthenticationPrincipal UserPrincipal principal, // UserPrincipal로 변경
            @RequestBody @Valid UpdateUser.PasswordRequest request) {

        if (principal == null) {
            log.error("[Auth Error] 인증 객체가 Null입니다.");
            throw new BusinessException(ErrorCode.UNAUTHORIZED);
        }

        userService.updatePassword(request.toCommand(principal.getId()));

        return ResponseEntity.ok(APIResponse.success(SuccessCode.OK));
    }

    @DeleteMapping("/me")
    public ResponseEntity<APIResponse<Void>> deleteAccount(
            @AuthenticationPrincipal UserPrincipal principal) { // 타입을 UserPrincipal로 변경

        if (principal == null) {
            log.error("[Auth Error] 인증 객체가 Null입니다.");
            throw new BusinessException(ErrorCode.UNAUTHORIZED);
        }

        userService.deleteAccount(principal.getId());
        return ResponseEntity.ok(APIResponse.success(SuccessCode.OK));
    }

    @GetMapping("/{userId}/representative")
    public ResponseEntity<APIResponse<GetReport>> getRepresentative(
            @PathVariable Long userId
    ) {
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(APIResponse.success(SuccessCode.OK, GetReport.from(reportService.getRepresentativeReport(userId))));
    }

    @GetMapping("/search")
    public ResponseEntity<APIResponse<List<UserSearchDto.Response>>> getPostLikeUsers(
            @RequestParam(name = "nickname", required = false) String nickname,
            @AuthenticationPrincipal UserPrincipal user
    ) {
        List<UserSearchSummary> summaries = userFacade.getUserSearch(nickname, user.getId());
        List<UserSearchDto.Response> response = summaries.stream()
                .map(UserSearchDto.Response::of)
                .toList();

        return ResponseEntity
                .status(SuccessCode.OK.getStatus())
                .body(APIResponse.success(SuccessCode.OK, response));
    }
}
