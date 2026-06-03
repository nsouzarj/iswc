package com.iswc.repository;

import com.iswc.model.Rightsholder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface RightsholderRepository extends JpaRepository<Rightsholder, UUID> {
    Optional<Rightsholder> findByIpiNameNumber(String ipiNameNumber);
    Optional<Rightsholder> findByIsni(String isni);
    Optional<Rightsholder> findByEmail(String email);
}
