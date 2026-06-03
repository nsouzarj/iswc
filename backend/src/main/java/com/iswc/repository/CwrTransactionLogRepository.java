package com.iswc.repository;

import com.iswc.model.CwrTransactionLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface CwrTransactionLogRepository extends JpaRepository<CwrTransactionLog, UUID> {
    List<CwrTransactionLog> findByRegistrationId(UUID registrationId);
    List<CwrTransactionLog> findByWorkId(UUID workId);
}
