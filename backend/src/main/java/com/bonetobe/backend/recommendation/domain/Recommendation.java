package com.bonetobe.backend.recommendation.domain;

import com.bonetobe.backend.cloth.domain.Cloth;
import com.bonetobe.backend.common.BaseEntity;
import com.bonetobe.backend.file.domain.StoredFile;
import com.bonetobe.backend.report.domain.Report;
import com.bonetobe.backend.user.domain.User;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
public class Recommendation extends BaseEntity {
    @Id
    private Long id;

    @MapsId
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "report_id")
    private Report report;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "best_picture_id")
    private StoredFile bestPicture;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "worst_picture_id")
    private StoredFile worstPicture;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "best_cloth")
    private Cloth bestCloth;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "worst_cloth")
    private Cloth worstCloth;

    @Column(nullable = false)
    private boolean pending = false;

    @Enumerated(EnumType.STRING)
    private TryOnStatus status = TryOnStatus.PENDING;

    public static Recommendation start(
        Report report,
        User user,
        StoredFile bestPicture,
        StoredFile worstPicture,
        Cloth bestCloth,
        Cloth worstCloth
    ) {
        Recommendation recommendation = new Recommendation();
        recommendation.report = report;
        recommendation.user = user;
        recommendation.bestPicture = bestPicture;
        recommendation.worstPicture = worstPicture;
        recommendation.bestCloth = bestCloth;
        recommendation.worstCloth = worstCloth;
        return recommendation;
    }

    public void complete() {
        status = TryOnStatus.COMPLETE;
    }
}
