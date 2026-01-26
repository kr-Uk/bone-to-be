package com.bonetobe.backend.post.presentation;

import com.bonetobe.backend.common.response.APIResponse;
import com.bonetobe.backend.common.response.PaginatedResponse;
import com.bonetobe.backend.common.response.SuccessCode;
import com.bonetobe.backend.post.application.PostFacade;
import com.bonetobe.backend.post.domain.query.PostDetailSummary;
import com.bonetobe.backend.post.domain.query.PostSummary;
import com.bonetobe.backend.post.presentation.dto.PostCreateDto;
import com.bonetobe.backend.post.presentation.dto.PostDeleteDto;
import com.bonetobe.backend.post.presentation.dto.PostDetailDto;
import com.bonetobe.backend.post.presentation.dto.PostListDto;
import com.bonetobe.backend.user.domain.User;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/feeds")
public class PostController {

    private final PostFacade postFacade;

    @GetMapping
    public ResponseEntity<APIResponse<PaginatedResponse<PostListDto.Response>>> getPostList(
            @ModelAttribute PostListDto.Request request,
            @PageableDefault(size = 20) Pageable pageable
    ) {

        Page<PostSummary> summaryPage = postFacade.getPostList(request.toQuery(), pageable);
        Page<PostListDto.Response> dtoPage = summaryPage.map(PostListDto.Response::of);

        PaginatedResponse<PostListDto.Response> paginated = PaginatedResponse.createPaginatedResponse(dtoPage);

        return ResponseEntity
                .status(SuccessCode.OK.getStatus())
                .body(APIResponse.success(SuccessCode.OK, paginated));
    }

    @GetMapping("/{feedId}")
    public ResponseEntity<APIResponse<PostDetailDto.Response>> getPostDetail(
            @PathVariable Long feedId
    ) {
        PostDetailSummary summary = postFacade.getPostDetail(feedId);
        PostDetailDto.Response response = PostDetailDto.Response.of(summary);

        return ResponseEntity
                .status(SuccessCode.OK.getStatus())
                .body(APIResponse.success(SuccessCode.OK, response));
    }

    @PostMapping
    public ResponseEntity<APIResponse<Void>> createPost(
            @RequestBody PostCreateDto.Request request,
            @AuthenticationPrincipal User user
    ) {
        postFacade.createPost(request.toCommand(user.getId()));

        return ResponseEntity
                .status(SuccessCode.OK.getStatus())
                .body(APIResponse.success(SuccessCode.OK));
    }

    @DeleteMapping("/{feedId}")
    public ResponseEntity<APIResponse<Void>> deletePost(
            @PathVariable Long feedId,
            @AuthenticationPrincipal User user
    ) {
        postFacade.deletePost(PostDeleteDto.Request.toCommand(user.getId(), feedId));

        return ResponseEntity
                .status(SuccessCode.OK.getStatus())
                .body(APIResponse.success(SuccessCode.OK));
    }

}
