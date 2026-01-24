package com.bonetobe.backend.post.presentation;

import com.bonetobe.backend.common.response.APIResponse;
import com.bonetobe.backend.common.response.PaginatedResponse;
import com.bonetobe.backend.common.response.SuccessCode;
import com.bonetobe.backend.post.application.PostFacade;
import com.bonetobe.backend.post.domain.query.PostSummary;
import com.bonetobe.backend.post.presentation.dto.PostListDto;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}
