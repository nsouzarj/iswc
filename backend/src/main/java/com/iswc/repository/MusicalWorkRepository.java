package com.iswc.repository;

import com.iswc.model.MusicalWork;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface MusicalWorkRepository extends JpaRepository<MusicalWork, UUID> {
    Optional<MusicalWork> findByIswc(String iswc);
    List<MusicalWork> findByTitleContainingIgnoreCase(String title);
}
