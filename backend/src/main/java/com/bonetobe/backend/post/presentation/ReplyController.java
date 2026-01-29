package com.bonetobe.backend.post.presentation;

import com.bonetobe.backend.common.response.APIResponse;
import com.bonetobe.backend.common.response.SuccessCode;
import com.bonetobe.backend.post.application.ReplyFacade;
import com.bonetobe.backend.post.domain.query.ReplySummary;
import com.bonetobe.backend.post.presentation.dto.ReplyCreateDto;
import com.bonetobe.backend.post.presentation.dto.ReplyDeleteDto;
import com.bonetobe.backend.post.presentation.dto.ReplyListDto;
import com.bonetobe.backend.user.infrastructure.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/feeds/{postId}/replies")
public class ReplyController {

    private final ReplyFacade replyFacade;

    @GetMapping
    public ResponseEntity<APIResponse<List<ReplyListDto.Response>>> getPostReplyList(
            @PathVariable Long postId,
            @AuthenticationPrincipal UserPrincipal user
    ) {
        List<ReplySummary> summaries = replyFacade.getReplyList(postId, user.getId());
        List<ReplyListDto.Response> response = summaries.stream()
                .map(ReplyListDto.Response::of)
                .toList();

        return ResponseEntity
                .status(SuccessCode.OK.getStatus())
                .body(APIResponse.success(SuccessCode.OK, response));
    }

    @PostMapping
    public ResponseEntity<APIResponse<Void>> createReply(
            @PathVariable Long postId,
            @RequestBody ReplyCreateDto.Request request,
            @AuthenticationPrincipal UserPrincipal user
    ) {
        replyFacade.createReply(request.toCommand(postId, user.getId()));

        return ResponseEntity
                .status(SuccessCode.OK.getStatus())
                .body(APIResponse.success(SuccessCode.OK));
    }

    @DeleteMapping("/{replyId}")
    public ResponseEntity<APIResponse<Void>> deleteReply(
            @PathVariable Long postId,
            @PathVariable Long replyId,
            @AuthenticationPrincipal UserPrincipal user
    ) {

        replyFacade.deleteReply(ReplyDeleteDto.Request.toCommand(postId, user.getId(), replyId));

        return ResponseEntity
                .status(SuccessCode.OK.getStatus())
                .body(APIResponse.success(SuccessCode.OK));
    }
}
