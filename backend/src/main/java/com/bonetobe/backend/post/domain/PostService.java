package com.bonetobe.backend.post.domain;

import com.bonetobe.backend.file.domain.StoredFile;
import com.bonetobe.backend.post.domain.command.PostCreateCommand;
import com.bonetobe.backend.post.domain.command.PostDeleteCommand;
import com.bonetobe.backend.post.domain.command.PostUpdateCommand;
import com.bonetobe.backend.post.domain.query.PostDetailSummaryRaw;
import com.bonetobe.backend.post.domain.query.PostListQuery;
import com.bonetobe.backend.post.domain.query.PostSummaryRaw;
import com.bonetobe.backend.style.domain.Style;
import com.bonetobe.backend.user.domain.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface PostService {
    Page<PostSummaryRaw> getPostList(PostListQuery query, Pageable pageable);

    PostDetailSummaryRaw getPostDetail(Long postId);

    void createPost(PostCreateCommand command, User user, StoredFile file, List<Style> styles);

    void deletePost(PostDeleteCommand command);

    void updatePost(Long postId, PostUpdateCommand command, List<Style> styles);

}
