package com.bonetobe.backend.post.infrastructure;

import com.bonetobe.backend.common.exception.BusinessException;
import com.bonetobe.backend.common.response.ErrorCode;
import com.bonetobe.backend.file.domain.StoredFile;
import com.bonetobe.backend.file.infrastructure.StoredFileJpaRepository;
import com.bonetobe.backend.post.domain.Post;
import com.bonetobe.backend.post.domain.PostStore;
import com.bonetobe.backend.post.domain.command.PostCreateCommand;
import com.bonetobe.backend.style.domain.Style;
import com.bonetobe.backend.style.domain.StyleName;
import com.bonetobe.backend.style.infrastructure.StyleJpaRepository;
import com.bonetobe.backend.user.domain.User;
import com.bonetobe.backend.user.infrastructure.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class PostStoreImpl implements PostStore {

    private final PostJpaRepository postJpaRepository;
    private final UserRepository userRepository;
    private final StoredFileJpaRepository storedFileJpaRepository;
    private final StyleJpaRepository styleJpaRepository;

    @Override
    public Post save(PostCreateCommand command) {

        User user = userRepository.findById(command.userId()).orElseThrow();
        StoredFile file = storedFileJpaRepository.findById(command.fileId()).orElseThrow();

        Post post = Post.create(
                user,
                file,
                command.skeletonType(),
                command.content()
        );

        List<StyleName> styleNames = command.styles();
        if (styleNames != null && !styleNames.isEmpty()) {
            List<Style> styles = styleNames.stream()
                    .distinct()
                    .map(name -> styleJpaRepository.findByStyleName(name)
                            .orElseThrow(() -> new BusinessException(ErrorCode.BAD_REQUEST))
                    )
                    .toList();

            post.applyStyles(styles);
        }

        return postJpaRepository.save(post);
    }
}
