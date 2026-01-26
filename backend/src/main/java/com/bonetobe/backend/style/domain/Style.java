package com.bonetobe.backend.style.domain;

import com.bonetobe.backend.common.BaseEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
public class Style extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "style_name")
    @Enumerated(value = EnumType.STRING)
    private StyleName styleName;

    private String description;
}
