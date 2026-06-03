package com.iswc.service;

import com.iswc.model.Rightsholder;
import com.iswc.repository.RightsholderRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class RightsholderService {

    private final RightsholderRepository rightsholderRepository;

    public RightsholderService(RightsholderRepository rightsholderRepository) {
        this.rightsholderRepository = rightsholderRepository;
    }

    public List<Rightsholder> getAllRightsholders() {
        return rightsholderRepository.findAll();
    }

    public Optional<Rightsholder> getRightsholderById(UUID id) {
        return rightsholderRepository.findById(id);
    }

    public Rightsholder createRightsholder(Rightsholder rightsholder) {
        if (rightsholder.getIpiNameNumber() != null && 
            rightsholderRepository.findByIpiNameNumber(rightsholder.getIpiNameNumber()).isPresent()) {
            throw new IllegalArgumentException("IPI Name Number already exists");
        }
        if (rightsholder.getIsni() != null && 
            rightsholderRepository.findByIsni(rightsholder.getIsni()).isPresent()) {
            throw new IllegalArgumentException("ISNI already exists");
        }
        if (rightsholder.getEmail() != null && 
            rightsholderRepository.findByEmail(rightsholder.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email already exists");
        }
        return rightsholderRepository.save(rightsholder);
    }
}
