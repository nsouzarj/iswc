package com.iswc.repository;

import com.iswc.model.Recording;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface RecordingRepository extends JpaRepository<Recording, UUID> {
    Optional<Recording> findByIsrc(String isrc);
    List<Recording> findByWorkId(UUID workId);
}
