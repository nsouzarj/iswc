package com.iswc.repository;

import com.iswc.model.WorkRightsholder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface WorkRightsholderRepository extends JpaRepository<WorkRightsholder, UUID> {
    List<WorkRightsholder> findByWorkId(UUID workId);
    List<WorkRightsholder> findByRightsholderId(UUID rightsholderId);
}
