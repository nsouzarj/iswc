package com.iswc.controller;

import com.iswc.model.Rightsholder;
import com.iswc.repository.RightsholderRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/rightsholders")
public class RightsholderController {

    private final RightsholderRepository rightsholderRepository;

    public RightsholderController(RightsholderRepository rightsholderRepository) {
        this.rightsholderRepository = rightsholderRepository;
    }

    @GetMapping
    public List<Rightsholder> getAllRightsholders() {
        return rightsholderRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Rightsholder> getRightsholderById(@PathVariable UUID id) {
        return rightsholderRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> createRightsholder(@Valid @RequestBody Rightsholder rightsholder) {
        try {
            // Check for unique field violations
            if (rightsholder.getIpiNameNumber() != null && 
                rightsholderRepository.findByIpiNameNumber(rightsholder.getIpiNameNumber()).isPresent()) {
                return ResponseEntity.badRequest().body(java.util.Map.of("error", "IPI Name Number already exists"));
            }
            if (rightsholder.getIsni() != null && 
                rightsholderRepository.findByIsni(rightsholder.getIsni()).isPresent()) {
                return ResponseEntity.badRequest().body(java.util.Map.of("error", "ISNI already exists"));
            }
            if (rightsholder.getEmail() != null && 
                rightsholderRepository.findByEmail(rightsholder.getEmail()).isPresent()) {
                return ResponseEntity.badRequest().body(java.util.Map.of("error", "Email already exists"));
            }
            
            Rightsholder saved = rightsholderRepository.save(rightsholder);
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(java.util.Map.of("error", "Error creating rightsholder: " + e.getMessage()));
        }
    }
}
