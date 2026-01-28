package com.bonetobe.backend.post.presentation;

import com.bonetobe.backend.common.response.APIResponse;
import com.bonetobe.backend.common.response.SuccessCode;
import com.bonetobe.backend.post.application.PostLikeFacade;
import com.bonetobe.backend.post.domain.query.PostLikeUserSummary;
import com.bonetobe.backend.post.presentation.dto.PostLikeUserDto;
import com.bonetobe.backend.user.infrastructure.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/feeds/{postId}/likes")
public class PostLikeController {
    private final PostLikeFacade postLikeFacade;

    @PostMapping
    public ResponseEntity<APIResponse<Void>> like(
            @PathVariable Long postId,
            @AuthenticationPrincipal UserPrincipal user
    ) {
        postLikeFacade.like(postId, user.getUserId());
        return ResponseEntity
                .status(SuccessCode.OK.getStatus())
                .body(APIResponse.success(SuccessCode.OK));
    }

    @DeleteMapping
    public ResponseEntity<APIResponse<Void>> unlike(
            @PathVariable Long postId,
            @AuthenticationPrincipal UserPrincipal user
    ) {
        postLikeFacade.unlike(postId, user.getUserId());
        return ResponseEntity
                .status(SuccessCode.OK.getStatus())
                .body(APIResponse.success(SuccessCode.OK));
    }

    @GetMapping()
    public ResponseEntity<APIResponse<List<PostLikeUserDto.Response>>> getPostLikeUsers(
            @PathVariable Long postId,
            @AuthenticationPrincipal UserPrincipal user
    ) {
        List<PostLikeUserSummary> summaries = postLikeFacade.getPostLikeUsers(postId, user.getUserId());
        List<PostLikeUserDto.Response> response = summaries.stream()
                .map(PostLikeUserDto.Response::of)
                .toList();

        return ResponseEntity
                .status(SuccessCode.OK.getStatus())
                .body(APIResponse.success(SuccessCode.OK, response));
    }

}
