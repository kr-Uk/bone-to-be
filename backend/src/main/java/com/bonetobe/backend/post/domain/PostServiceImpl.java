package com.bonetobe.backend.post.domain;

import com.bonetobe.backend.file.domain.FileService;
import com.bonetobe.backend.file.presentation.FileDownloadUrl;
import com.bonetobe.backend.post.domain.query.PostListQuery;
import com.bonetobe.backend.post.domain.query.PostSummary;
import com.bonetobe.backend.post.domain.query.PostSummaryRaw;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PostServiceImpl implements PostService {

    private final PostReader postReader;
    private final FileService fileService;

    @Override
    @Transactional(readOnly = true)
    public Page<PostSummary> getPostList(PostListQuery query, Pageable pageable) {
        Page<PostSummaryRaw> rawPage = postReader.findPostList(query, pageable);

        // fileId 갖고오기
        List<Long> fileIds = rawPage.getContent().stream()
                .map(PostSummaryRaw::fileId)
                .filter(Objects::nonNull)
                .distinct()
                .toList();

        // presigned url 발급
        // fileId -> presigned url로 매핑 과정
        Map<Long, String> urlMap = Collections.emptyMap();
        if (!fileIds.isEmpty()) {
            List<FileDownloadUrl.Query> queries = fileIds.stream()
                    .map(FileDownloadUrl.Query::new)
                    .toList();

            urlMap = fileService.getPublicDownloadUrls(queries).stream()
                    .collect(Collectors.toMap(
                            FileDownloadUrl.Result::fileId,
                            FileDownloadUrl.Result::presignedUrl
                    ));
        }

        // raw -> summary 변환 (imageUrl 채우기)
        Map<Long, String> finalUrlMap = urlMap;
        return rawPage.map(r -> new PostSummary(
                r.postId(),
                finalUrlMap.get(r.fileId()),
                r.gender(),
                r.skeletonType(),
                r.style(),
                r.height(),
                r.weight(),
                r.isLiked(),
                r.createdAt()
        ));
    }
}
