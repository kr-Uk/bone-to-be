package com.bonetobe.backend.style.domain;

import java.util.List;

public interface StyleService {
    List<Style> getStylesByNames(List<StyleName> names);
}
