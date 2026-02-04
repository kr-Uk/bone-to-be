package com.bonetobe.backend.cloth.domain;

import com.bonetobe.backend.cloth.infrastructure.ClothRepository;
import com.bonetobe.backend.common.SkeletonType;
import com.bonetobe.backend.common.exception.BusinessException;
import com.bonetobe.backend.common.response.ErrorCode;
import com.bonetobe.backend.file.domain.FileService;
import com.bonetobe.backend.file.presentation.FileDownloadUrl;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ClothServiceImpl implements ClothService {
    private final ClothRepository clothRepository;
    private final FileService fileService;
    @Override
    public BestWorstClothDownload getClothDownloadPresignedUrls(SkeletonType skeletonType) {
        Cloth bestCloth = clothRepository.findByBestSkeletonType(skeletonType).orElseThrow(() -> new BusinessException(ErrorCode.NOT_FOUND_CLOTH));
        Cloth worstCloth = clothRepository.findByWorstSkeletonType(skeletonType).orElseThrow(() -> new BusinessException(ErrorCode.NOT_FOUND_CLOTH));
        List<FileDownloadUrl.Result> publicDownloadUrls = fileService.getPublicDownloadUrls(List.of(new FileDownloadUrl.Query(bestCloth.getFile().getId()), new FileDownloadUrl.Query(worstCloth.getFile().getId())));
        Map<Long, String> urlMap = publicDownloadUrls.stream()
            .collect(Collectors.toMap(
                FileDownloadUrl.Result::fileId,
                FileDownloadUrl.Result::presignedUrl
            ));
        return new BestWorstClothDownload(
            bestCloth.getId(),
            urlMap.get(bestCloth.getFile().getId()),
            worstCloth.getId(),
            urlMap.get(worstCloth.getFile().getId()));
    }
}
