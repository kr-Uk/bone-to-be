package com.bonetobe.backend.post.presentation;

import com.bonetobe.backend.common.response.PaginatedResponse;
import com.bonetobe.backend.post.application.PostFacade;
import com.bonetobe.backend.post.application.query.PostSummary;
import com.bonetobe.backend.post.presentation.dto.PostDto;
import com.bonetobe.backend.post.presentation.dto.PostListGetDto;
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
@RequestMapping
public class PostController {

    private final PostFacade postFacade;

    @GetMapping("/feeds")
    public ResponseEntity<PaginatedResponse<PostDto>> getPostList(
            @ModelAttribute PostListGetDto.Request request,
            @PageableDefault(size = 20) Pageable pageable
    ) {

        Page<PostSummary> summaryPage = postFacade.getPostList(request.toCondition(), pageable);

        Page<PostDto> dtoPage = summaryPage.map(PostDto::of);

        return ResponseEntity.ok(PaginatedResponse.createPaginatedResponse(dtoPage));
    }
}
