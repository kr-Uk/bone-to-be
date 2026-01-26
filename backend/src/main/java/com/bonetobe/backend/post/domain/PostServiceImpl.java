package com.bonetobe.backend.post.domain;

import com.bonetobe.backend.common.exception.BusinessException;
import com.bonetobe.backend.common.response.ErrorCode;
import com.bonetobe.backend.post.domain.command.PostCreateCommand;
import com.bonetobe.backend.post.domain.command.PostDeleteCommand;
import com.bonetobe.backend.post.domain.command.PostUpdateCommand;
import com.bonetobe.backend.post.domain.query.PostDetailSummaryRaw;
import com.bonetobe.backend.post.domain.query.PostListQuery;
import com.bonetobe.backend.post.domain.query.PostSummaryRaw;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Transactional
@Service
@RequiredArgsConstructor
public class PostServiceImpl implements PostService {
    private final PostReader postReader;
    private final PostStore postStore;

    @Override
    @Transactional(readOnly = true)
    public Page<PostSummaryRaw> getPostList(PostListQuery query, Pageable pageable) {
        return postReader.findPostList(query, pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public PostDetailSummaryRaw getPostDetail(Long postId) {
        return postReader.findPostDetail(postId);
    }

    @Override
    public void createPost(PostCreateCommand command) {
        postStore.save(command);
    }

    @Override
    public void deletePost(PostDeleteCommand command) {
        Post post = postReader.getById(command.postId());

        if (!post.getUser().getId().equals(command.userId())) {
            throw new BusinessException(ErrorCode.FORBIDDEN);
        }

        postStore.delete(post);
    }

    @Override
    public void updatePost(Long postId, PostUpdateCommand command){
        Post post = postReader.getById(postId);

        if (!post.getUser().getId().equals(command.userId())) {
            throw new BusinessException(ErrorCode.FORBIDDEN);
        }

        // styles, content 등 실제 수정
        postStore.update(post, command);
    }

}
