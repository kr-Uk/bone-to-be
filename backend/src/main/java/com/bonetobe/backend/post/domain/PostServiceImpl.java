package com.bonetobe.backend.post.domain;

import com.bonetobe.backend.common.exception.BusinessException;
import com.bonetobe.backend.common.response.ErrorCode;
import com.bonetobe.backend.file.domain.StoredFile;
import com.bonetobe.backend.post.domain.command.PostCreateCommand;
import com.bonetobe.backend.post.domain.command.PostDeleteCommand;
import com.bonetobe.backend.post.domain.command.PostUpdateCommand;
import com.bonetobe.backend.post.domain.query.MyPostSummaryRaw;
import com.bonetobe.backend.post.domain.query.PostDetailSummaryRaw;
import com.bonetobe.backend.post.domain.query.PostListQuery;
import com.bonetobe.backend.post.domain.query.PostSummaryRaw;
import com.bonetobe.backend.style.domain.Style;
import com.bonetobe.backend.user.domain.User;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

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
    public PostDetailSummaryRaw getPostDetail(Long postId, Long viewerId) {
        return postReader.findPostDetail(postId, viewerId);
    }

    @Override
    public void createPost(PostCreateCommand command, User user, StoredFile file, List<Style> styles) {

        Post post = Post.create(
                user,
                file,
                command.content(),
                command.gender(),
                command.skeletonType(),
                command.height(),
                command.weight()
        );

        post.applyStyles(styles);

        postStore.save(post);
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
    public void updatePost(Long postId, PostUpdateCommand command, List<Style> styles) {
        Post post = postReader.getById(postId);

        if (!post.getUser().getId().equals(command.userId())) {
            throw new BusinessException(ErrorCode.FORBIDDEN);
        }

        post.update(
                command.content(),
                command.gender(),
                command.skeletonType(),
                styles,
                command.height(),
                command.weight()
        );

    }

    @Override
    @Transactional(readOnly = true)
    public List<MyPostSummaryRaw> getMyPostList(Long userId) {
        return postReader.findMyPostList(userId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PostSummaryRaw> getLikedPostList(Long userId) {
        return postReader.findLikedPostList(userId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PostSummaryRaw> getScrappedPostList(Long userId) {
        return postReader.findScrappedPostList(userId);
    }

}
