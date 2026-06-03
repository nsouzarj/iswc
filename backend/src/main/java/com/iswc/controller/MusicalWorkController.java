package com.iswc.controller;

import com.iswc.model.MusicalWork;
import com.iswc.model.Rightsholder;
import com.iswc.model.WorkRightsholder;
import com.iswc.repository.MusicalWorkRepository;
import com.iswc.repository.RightsholderRepository;
import com.iswc.repository.WorkRightsholderRepository;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.util.*;

@RestController
@RequestMapping("/works")
public class MusicalWorkController {

    private final MusicalWorkRepository workRepository;
    private final WorkRightsholderRepository workRightsholderRepository;
    private final RightsholderRepository rightsholderRepository;

    public MusicalWorkController(MusicalWorkRepository workRepository,
                                 WorkRightsholderRepository workRightsholderRepository,
                                 RightsholderRepository rightsholderRepository) {
        this.workRepository = workRepository;
        this.workRightsholderRepository = workRightsholderRepository;
        this.rightsholderRepository = rightsholderRepository;
    }

    @GetMapping
    public List<Map<String, Object>> getAllWorks() {
        List<MusicalWork> works = workRepository.findAll();
        List<Map<String, Object>> response = new ArrayList<>();
        
        for (MusicalWork w : works) {
            Map<String, Object> item = new HashMap<>();
            item.put("id", w.getId());
            item.put("title", w.getTitle());
            item.put("iswc", w.getIswc());
            item.put("languageCode", w.getLanguageCode());
            item.put("musicalGenre", w.getMusicalGenre());
            item.put("status", w.getStatus());
            
            List<WorkRightsholder> splits = workRightsholderRepository.findByWorkId(w.getId());
            item.put("splits", splits);
            
            response.add(item);
        }
        
        return response;
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getWorkById(@PathVariable UUID id) {
        Optional<MusicalWork> workOpt = workRepository.findById(id);
        if (workOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        List<WorkRightsholder> splits = workRightsholderRepository.findByWorkId(id);
        
        Map<String, Object> response = new HashMap<>();
        response.put("work", workOpt.get());
        response.put("splits", splits);
        
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<?> createWork(@Valid @RequestBody MusicalWork work) {
        try {
            if (work.getIswc() != null && workRepository.findByIswc(work.getIswc()).isPresent()) {
                return ResponseEntity.badRequest().body(Map.of("error", "ISWC already exists"));
            }
            MusicalWork saved = workRepository.save(work);
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error creating work: " + e.getMessage()));
        }
    }

    @PostMapping("/{id}/splits")
    @Transactional
    public ResponseEntity<?> saveSplits(@PathVariable UUID id, @RequestBody List<SplitRequest> splitRequests) {
        Optional<MusicalWork> workOpt = workRepository.findById(id);
        if (workOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Work not found"));
        }
        
        MusicalWork work = workOpt.get();

        // 1. Delete existing splits for this work
        List<WorkRightsholder> existingSplits = workRightsholderRepository.findByWorkId(id);
        workRightsholderRepository.deleteAll(existingSplits);

        // 2. Validate and save new splits
        BigDecimal totalMechanical = BigDecimal.ZERO;
        BigDecimal totalPerformance = BigDecimal.ZERO;
        List<WorkRightsholder> toSave = new ArrayList<>();

        for (SplitRequest req : splitRequests) {
            Optional<Rightsholder> holderOpt = rightsholderRepository.findById(req.getRightsholderId());
            if (holderOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("error", "Rightsholder not found with ID: " + req.getRightsholderId()));
            }

            BigDecimal mech = req.getMechanicalSplit() != null ? req.getMechanicalSplit() : BigDecimal.ZERO;
            BigDecimal perf = req.getPerformanceSplit() != null ? req.getPerformanceSplit() : BigDecimal.ZERO;
            BigDecimal pub = req.getPublisherSplit() != null ? req.getPublisherSplit() : BigDecimal.ZERO;

            totalMechanical = totalMechanical.add(mech);
            totalPerformance = totalPerformance.add(perf);

            WorkRightsholder wr = new WorkRightsholder(
                work, holderOpt.get(), req.getRole(), mech, perf, pub
            );
            toSave.add(wr);
        }

        // Save all splits
        List<WorkRightsholder> savedSplits = workRightsholderRepository.saveAll(toSave);

        // 3. Update work status based on split balance (100% total)
        // Comparison using compareTo to handle decimal scaling issues
        boolean isBalanced = (totalMechanical.compareTo(new BigDecimal("100.00")) == 0) &&
                             (totalPerformance.compareTo(new BigDecimal("100.00")) == 0);

        if (isBalanced) {
            work.setStatus("ACTIVE");
        } else {
            work.setStatus("CONFLICT");
        }
        workRepository.save(work);

        Map<String, Object> response = new HashMap<>();
        response.put("status", work.getStatus());
        response.put("totalMechanicalSplit", totalMechanical);
        response.put("totalPerformanceSplit", totalPerformance);
        response.put("splits", savedSplits);

        return ResponseEntity.ok(response);
    }

    // DTO class for Splits Request
    public static class SplitRequest {
        private UUID rightsholderId;
        private String role;
        private BigDecimal mechanicalSplit;
        private BigDecimal performanceSplit;
        private BigDecimal publisherSplit;

        public UUID getRightsholderId() {
            return rightsholderId;
        }

        public void setRightsholderId(UUID rightsholderId) {
            this.rightsholderId = rightsholderId;
        }

        public String getRole() {
            return role;
        }

        public void setRole(String role) {
            this.role = role;
        }

        public BigDecimal getMechanicalSplit() {
            return mechanicalSplit;
        }

        public void setMechanicalSplit(BigDecimal mechanicalSplit) {
            this.mechanicalSplit = mechanicalSplit;
        }

        public BigDecimal getPerformanceSplit() {
            return performanceSplit;
        }

        public void setPerformanceSplit(BigDecimal performanceSplit) {
            this.performanceSplit = performanceSplit;
        }

        public BigDecimal getPublisherSplit() {
            return publisherSplit;
        }

        public void setPublisherSplit(BigDecimal publisherSplit) {
            this.publisherSplit = publisherSplit;
        }
    }
}
