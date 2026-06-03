package com.iswc.controller;

import com.iswc.model.Rightsholder;
import com.iswc.service.RightsholderService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/rightsholders")
public class RightsholderController {

    private final RightsholderService rightsholderService;

    public RightsholderController(RightsholderService rightsholderService) {
        this.rightsholderService = rightsholderService;
    }

    @GetMapping
    public List<Rightsholder> getAllRightsholders() {
        return rightsholderService.getAllRightsholders();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Rightsholder> getRightsholderById(@PathVariable UUID id) {
        return rightsholderService.getRightsholderById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> createRightsholder(@Valid @RequestBody Rightsholder rightsholder) {
        try {
            Rightsholder saved = rightsholderService.createRightsholder(rightsholder);
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(java.util.Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(java.util.Map.of("error", "Error creating rightsholder: " + e.getMessage()));
        }
    }
}
