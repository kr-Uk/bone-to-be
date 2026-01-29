package com.bonetobe.backend.user.application;

import com.bonetobe.backend.file.domain.FileService;
import com.bonetobe.backend.file.presentation.FileUploadUrl;
import com.bonetobe.backend.user.domain.UserService;
import com.bonetobe.backend.user.domain.command.UserFileCommand;
import com.bonetobe.backend.user.domain.query.UserFileSummary;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

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
}