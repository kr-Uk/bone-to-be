package com.bonetobe.backend.style.infrastructure;

import com.bonetobe.backend.style.domain.Style;
import com.bonetobe.backend.style.domain.StyleName;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface StyleJpaRepository extends JpaRepository<Style, Long> {
    List<Style> findAllByStyleNameIn(List<StyleName> names);

}
