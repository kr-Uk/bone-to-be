package com.bonetobe.backend.file.infrastructure;

import com.bonetobe.backend.file.domain.StoredFile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StoredFileJpaRepository extends JpaRepository<StoredFile, Long> {
    @Query("""
        select f
        from StoredFile as f
        where f.id in :fileIds
            and f.status = 'UPLOADED'
    """)
    List<StoredFile> findByList(List<Long> fileIds);

    @Query("""
        select f
        from StoredFile as f
        where f.id in :fileIds
            and f.ownerId = :userId
            and f.status = 'UPLOADED'
    """)
    List<StoredFile> findByListAndUserId(List<Long> fileIds, Long userId);
}
