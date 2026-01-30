package com.bonetobe.backend.user.application;

import com.bonetobe.backend.file.domain.FileService;
import com.bonetobe.backend.file.presentation.FileDownloadUrl;
import com.bonetobe.backend.file.presentation.FileUploadUrl;
import com.bonetobe.backend.user.domain.UserService;
import com.bonetobe.backend.user.domain.command.UserFileCommand;
import com.bonetobe.backend.user.domain.query.UserFileSummary;
import com.bonetobe.backend.user.domain.query.UserSearchSummary;
import com.bonetobe.backend.user.domain.query.UserSearchSummaryRaw;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class UserFacade {
    private final FileService fileService;
    private final UserService userService;

    @Transactional
    public UserFileSummary issueProfilePresignedUrl(UserFileCommand command) {
        FileUploadUrl.Request req = new FileUploadUrl.Request(
                command.originalFileName(),
                command.contentType(),
                command.fileSize()
        );

        FileUploadUrl.Response res = fileService.createUploadUrl(req, command.userId(), command.fileDomainCategory());

        return new UserFileSummary(
                res.fileId(),
                res.uploadUrl()
        );
    }

    @Transactional(readOnly = true)
    public List<UserSearchSummary> getUserSearch(String nickname, Long viewerId) {
        List<UserSearchSummaryRaw> raws = userService.getUserSearch(nickname, viewerId);

        List<Long> fileIds = raws.stream()
                .map(UserSearchSummaryRaw::fileId)
                .distinct()
                .toList();

        Map<Long, String> urlMap = fileService.getPublicDownloadUrls(
                        fileIds.stream().map(FileDownloadUrl.Query::new).toList()
                ).stream()
                .collect(Collectors.toMap(
                        FileDownloadUrl.Result::fileId,
                        FileDownloadUrl.Result::presignedUrl
                ));

        return raws.stream()
                .map(r -> r.toSummary(urlMap.get(r.fileId())))
                .toList();
    }
}