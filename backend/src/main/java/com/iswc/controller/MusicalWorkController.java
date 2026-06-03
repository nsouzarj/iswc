package com.iswc.controller;

import com.iswc.dto.SplitRequest;
import com.iswc.model.MusicalWork;
import com.iswc.model.WorkRightsholder;
import com.iswc.service.MusicalWorkService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/works")
public class MusicalWorkController {

    private final MusicalWorkService workService;

    public MusicalWorkController(MusicalWorkService workService) {
        this.workService = workService;
    }

    @GetMapping
    public List<Map<String, Object>> getAllWorks() {
        return workService.getAllWorks();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getWorkById(@PathVariable UUID id) {
        Optional<MusicalWork> workOpt = workService.getWorkById(id);
        if (workOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        List<WorkRightsholder> splits = workService.getSplitsForWork(id);
        
        Map<String, Object> response = new HashMap<>();
        response.put("work", workOpt.get());
        response.put("splits", splits);
        
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<?> createWork(@Valid @RequestBody MusicalWork work) {
        try {
            MusicalWork saved = workService.createWork(work);
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error creating work: " + e.getMessage()));
        }
    }

    @PostMapping("/{id}/splits")
    public ResponseEntity<?> saveSplits(@PathVariable UUID id, @RequestBody List<SplitRequest> splitRequests) {
        try {
            Map<String, Object> result = workService.saveSplits(id, splitRequests);
            return ResponseEntity.ok(result);
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error saving split sheet: " + e.getMessage()));
        }
    }
}
