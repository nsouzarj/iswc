package com.iswc.service;

import com.iswc.dto.SplitRequest;
import com.iswc.model.MusicalWork;
import com.iswc.model.Rightsholder;
import com.iswc.model.WorkRightsholder;
import com.iswc.repository.MusicalWorkRepository;
import com.iswc.repository.RightsholderRepository;
import com.iswc.repository.WorkRightsholderRepository;
import com.iswc.util.MetadataValidator;
import org.springframework.stereotype.Service;
import jakarta.transaction.Transactional;
import java.math.BigDecimal;
import java.util.*;

@Service
public class MusicalWorkService {

    private final MusicalWorkRepository workRepository;
    private final WorkRightsholderRepository workRightsholderRepository;
    private final RightsholderRepository rightsholderRepository;

    public MusicalWorkService(MusicalWorkRepository workRepository,
                              WorkRightsholderRepository workRightsholderRepository,
                              RightsholderRepository rightsholderRepository) {
        this.workRepository = workRepository;
        this.workRightsholderRepository = workRightsholderRepository;
        this.rightsholderRepository = rightsholderRepository;
    }

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

    public Optional<MusicalWork> getWorkById(UUID id) {
        return workRepository.findById(id);
    }

    public List<WorkRightsholder> getSplitsForWork(UUID workId) {
        return workRightsholderRepository.findByWorkId(workId);
    }

    public MusicalWork createWork(MusicalWork work) {
        if (work.getIswc() != null) {
            if (!MetadataValidator.validateIswc(work.getIswc())) {
                throw new IllegalArgumentException("Invalid ISWC check digit");
            }
            if (workRepository.findByIswc(work.getIswc()).isPresent()) {
                throw new IllegalArgumentException("ISWC already exists");
            }
        }
        return workRepository.save(work);
    }

    @Transactional
    public Map<String, Object> saveSplits(UUID workId, List<SplitRequest> splitRequests) {
        Optional<MusicalWork> workOpt = workRepository.findById(workId);
        if (workOpt.isEmpty()) {
            throw new NoSuchElementException("Work not found with ID: " + workId);
        }
        
        MusicalWork work = workOpt.get();

        // Validate splits request before making modifications
        Set<UUID> rightsholderIds = new HashSet<>();
        for (SplitRequest req : splitRequests) {
            if (req.getRightsholderId() == null) {
                throw new IllegalArgumentException("Rightsholder ID cannot be null");
            }
            if (!rightsholderIds.add(req.getRightsholderId())) {
                throw new IllegalArgumentException("Duplicate rightsholder in split sheet");
            }

            BigDecimal mech = req.getMechanicalSplit() != null ? req.getMechanicalSplit() : BigDecimal.ZERO;
            BigDecimal perf = req.getPerformanceSplit() != null ? req.getPerformanceSplit() : BigDecimal.ZERO;
            BigDecimal pub = req.getPublisherSplit() != null ? req.getPublisherSplit() : BigDecimal.ZERO;

            if (mech.compareTo(BigDecimal.ZERO) < 0 || mech.compareTo(new BigDecimal("100.00")) > 0 ||
                perf.compareTo(BigDecimal.ZERO) < 0 || perf.compareTo(new BigDecimal("100.00")) > 0 ||
                pub.compareTo(BigDecimal.ZERO) < 0 || pub.compareTo(new BigDecimal("100.00")) > 0) {
                throw new IllegalArgumentException("Split percentages must be between 0.00% and 100.00%");
            }
        }

        // 1. Delete existing splits for this work
        List<WorkRightsholder> existingSplits = workRightsholderRepository.findByWorkId(workId);
        workRightsholderRepository.deleteAll(existingSplits);

        // 2. Validate and save new splits
        BigDecimal totalMechanical = BigDecimal.ZERO;
        BigDecimal totalPerformance = BigDecimal.ZERO;
        List<WorkRightsholder> toSave = new ArrayList<>();

        for (SplitRequest req : splitRequests) {
            Optional<Rightsholder> holderOpt = rightsholderRepository.findById(req.getRightsholderId());
            if (holderOpt.isEmpty()) {
                throw new NoSuchElementException("Rightsholder not found with ID: " + req.getRightsholderId());
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

        return response;
    }
}
