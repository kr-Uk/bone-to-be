package com.bonetobe.backend.post.presentation;

import com.bonetobe.backend.common.response.APIResponse;
import com.bonetobe.backend.common.response.PaginatedResponse;
import com.bonetobe.backend.common.response.SuccessCode;
import com.bonetobe.backend.post.application.PostFacade;
import com.bonetobe.backend.post.domain.query.UserPostSummary;
import com.bonetobe.backend.post.domain.query.PostDetailSummary;
import com.bonetobe.backend.post.domain.query.PostFileSummary;
import com.bonetobe.backend.post.domain.query.PostSummary;
import com.bonetobe.backend.post.presentation.dto.*;
import com.bonetobe.backend.user.infrastructure.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/feeds")
public class PostController {

    private final PostFacade postFacade;

    // 전체 게시글 목록
    @GetMapping
    public ResponseEntity<APIResponse<PaginatedResponse<PostListDto.Response>>> getPostList(
            @ModelAttribute PostListDto.Request request,
            @AuthenticationPrincipal UserPrincipal user,
            @PageableDefault(size = 20) Pageable pageable
    ) {

        Page<PostSummary> summaryPage = postFacade.getPostList(request.toQuery(user.getId()), pageable);
        Page<PostListDto.Response> dtoPage = summaryPage.map(PostListDto.Response::of);

        PaginatedResponse<PostListDto.Response> paginated = PaginatedResponse.createPaginatedResponse(dtoPage);

        return ResponseEntity
                .status(SuccessCode.OK.getStatus())
                .body(APIResponse.success(SuccessCode.OK, paginated));
    }

    // 게시글 상세조회
    @GetMapping("/{feedId}")
    public ResponseEntity<APIResponse<PostDetailDto.Response>> getPostDetail(
            @PathVariable Long feedId,
            @AuthenticationPrincipal UserPrincipal user
    ) {
        PostDetailSummary summary = postFacade.getPostDetail(feedId, user.getId());
        PostDetailDto.Response response = PostDetailDto.Response.of(summary);

        return ResponseEntity
                .status(SuccessCode.OK.getStatus())
                .body(APIResponse.success(SuccessCode.OK, response));
    }

    // 게시글 생성
    @PostMapping
    public ResponseEntity<APIResponse<Void>> createPost(
            @RequestBody PostCreateDto.Request request,
            @AuthenticationPrincipal UserPrincipal user
    ) {
        postFacade.createPost(request.toCommand(user.getId()));
        return ResponseEntity
                .status(SuccessCode.OK.getStatus())
                .body(APIResponse.success(SuccessCode.OK));
    }

    // 게시글 삭제
    @DeleteMapping("/{postId}")
    public ResponseEntity<APIResponse<Void>> deletePost(
            @PathVariable Long postId,
            @AuthenticationPrincipal UserPrincipal user
    ) {
        postFacade.deletePost(PostDeleteDto.Request.toCommand(user.getId(), postId));

        return ResponseEntity
                .status(SuccessCode.OK.getStatus())
                .body(APIResponse.success(SuccessCode.OK));
    }

    // 게시글 수정
    @PutMapping("/{postId}")
    public ResponseEntity<APIResponse<Void>> updatePost(
            @PathVariable Long postId,
            @RequestBody PostUpdateDto.Request request,
            @AuthenticationPrincipal UserPrincipal user
    ) {
        postFacade.updatePost(postId, request.toCommand(user.getId()));
        return ResponseEntity.ok(APIResponse.success(SuccessCode.OK));
    }

    // presigned url 발급
    @PostMapping("/presigned-url")
    public ResponseEntity<APIResponse<PostFileDto.Response>> issuePresignedUrl(
            @RequestBody PostFileDto.Request request,
            @AuthenticationPrincipal UserPrincipal user
    ) {
        PostFileSummary summary = postFacade.issuePresignedUrl(request.toCommand(user.getId()));
        PostFileDto.Response response = PostFileDto.Response.of(summary);
        return ResponseEntity
                .status(SuccessCode.OK.getStatus())
                .body(APIResponse.success(SuccessCode.OK, response));
    }

    // 내가 쓴 게시글 목록
    @GetMapping("/me")
    public ResponseEntity<APIResponse<List<UserPostListDto.Response>>> getMyPostList(
            @AuthenticationPrincipal UserPrincipal user
    ) {
        List<UserPostSummary> summaries = postFacade.getUserPostList(user.getId());
        List<UserPostListDto.Response> responses = summaries.stream()
                .map(UserPostListDto.Response::of)
                .toList();

        return ResponseEntity
                .status(SuccessCode.OK.getStatus())
                .body(APIResponse.success(SuccessCode.OK, responses));
    }

    // 내가 좋아요 한 게시글 목록
    @GetMapping("/liked")
    public ResponseEntity<APIResponse<PostListWithCountDto.Response>> getLikedPostList(
            @AuthenticationPrincipal UserPrincipal user
    ) {
        List<PostSummary> summaries = postFacade.getLikedPostList(user.getId());
        List<PostListDto.Response> responses = summaries.stream()
                .map(PostListDto.Response::of)
                .toList();

        return ResponseEntity
                .status(SuccessCode.OK.getStatus())
                .body(APIResponse.success(SuccessCode.OK, PostListWithCountDto.Response.of(responses)));
    }

    // 내가 스크랩 한 게시글 목록
    @GetMapping("/scrapped")
    public ResponseEntity<APIResponse<List<PostListDto.Response>>> getScrappedPostList(
            @AuthenticationPrincipal UserPrincipal user
    ) {
        List<PostSummary> summaries = postFacade.getScrappedPostList(user.getId());
        List<PostListDto.Response> responses = summaries.stream()
                .map(PostListDto.Response::of)
                .toList();

        return ResponseEntity
                .status(SuccessCode.OK.getStatus())
                .body(APIResponse.success(SuccessCode.OK, responses));
    }

    @GetMapping("/users/{userId}")
    public ResponseEntity<APIResponse<List<UserPostListDto.Response>>> getUserPostList(
            @PathVariable Long userId
    ) {
        List<UserPostSummary> summaries = postFacade.getUserPostList(userId);
        List<UserPostListDto.Response> responses = summaries.stream()
                .map(UserPostListDto.Response::of)
                .toList();

        return ResponseEntity
                .status(SuccessCode.OK.getStatus())
                .body(APIResponse.success(SuccessCode.OK, responses));
    }

}
