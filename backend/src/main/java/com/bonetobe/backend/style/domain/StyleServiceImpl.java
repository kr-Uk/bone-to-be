package com.bonetobe.backend.style.domain;

import com.bonetobe.backend.style.infrastructure.StyleJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StyleServiceImpl implements StyleService {

    private final StyleJpaRepository styleJpaRepository;

    @Override
    public List<Style> getStylesByNames(List<StyleName> names) {
        if (names == null || names.isEmpty()) return List.of();

        return styleJpaRepository.findAllByStyleNameIn(names);
    }
}

