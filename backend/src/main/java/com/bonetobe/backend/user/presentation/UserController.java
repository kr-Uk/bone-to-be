package com.bonetobe.backend.user.presentation;

import com.bonetobe.backend.common.response.APIResponse;
import com.bonetobe.backend.common.response.SuccessCode;
import com.bonetobe.backend.user.domain.User;
import com.bonetobe.backend.user.domain.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/users")
public class UserController {
    private final UserService userService;

    @PatchMapping("/me/password")
    public ResponseEntity<APIResponse<Void>> updatePassword(
            @AuthenticationPrincipal User user,
            @RequestBody @Valid UpdateUser.PasswordRequest request) {

        userService.updatePassword(request.toCommand(user.getId()));
        return ResponseEntity.ok(APIResponse.success(SuccessCode.OK));
    }

    @DeleteMapping("/me")
    public ResponseEntity<APIResponse<Void>> deleteAccount(
            @AuthenticationPrincipal User user) {

        userService.deleteAccount(user.getId());
        return ResponseEntity.ok(APIResponse.success(SuccessCode.OK));
    }
}
