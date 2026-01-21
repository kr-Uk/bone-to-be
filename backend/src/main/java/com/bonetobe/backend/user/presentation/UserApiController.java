package com.bonetobe.backend.user.presentation;

import com.bonetobe.backend.common.response.APIResponse;
import com.bonetobe.backend.common.response.SuccessCode;
import com.bonetobe.backend.user.domain.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/auth")
public class UserApiController {
    private final UserService userService;

    @PostMapping("/signup")
    public ResponseEntity<APIResponse<Long>> signup(@RequestBody AddUserRequest request) {
        log.info("회원가입 요청 수신: email={}", request.getEmail());

        Long userId = userService.save(request);
        log.info("회원가입 완료: userId={}", userId);

        return ResponseEntity
                .status(SuccessCode.CREATED.getStatus())
                .body(APIResponse.success(SuccessCode.CREATED, userId));
    }
}
