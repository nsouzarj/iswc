package com.iswc.repository;

import com.iswc.model.CwrRegistration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CwrRegistrationRepository extends JpaRepository<CwrRegistration, UUID> {
    Optional<CwrRegistration> findByFilename(String filename);
}
