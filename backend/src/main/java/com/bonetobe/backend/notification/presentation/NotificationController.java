package com.bonetobe.backend.notification.presentation;

import com.bonetobe.backend.common.response.APIResponse;
import com.bonetobe.backend.common.response.SuccessCode;
import com.bonetobe.backend.notification.application.NotificationFacade;
import com.bonetobe.backend.notification.adapter.NotificationService;
import com.bonetobe.backend.user.infrastructure.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/notifications")
public class NotificationController {
    private final NotificationService notificationService;
    private final NotificationFacade notificationFacade;

    @GetMapping(value = "/subscribe", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter subscribe(
        @AuthenticationPrincipal UserPrincipal user
    ) {
        return notificationService.subscribe(user.getId());
    }

    @GetMapping
    public ResponseEntity<APIResponse<List<GetNotification>>> getNotification(
        @AuthenticationPrincipal UserPrincipal user
    ) {
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(APIResponse.success(
                    SuccessCode.OK,
                    notificationService.getNotifications(user.getId())
                        .stream()
                        .map(GetNotification::of).toList()));
    }

    @PutMapping
    public ResponseEntity<APIResponse<Void>> deleteNotification(
        @AuthenticationPrincipal UserPrincipal user,
        @RequestParam String uuid
    ) {
        notificationFacade.deleteNotifications(user.getId(), uuid);
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(APIResponse.success(
                    SuccessCode.OK
                ));
    }
}
