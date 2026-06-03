package com.iswc.dto;

import java.math.BigDecimal;
import java.util.UUID;

public class SplitRequest {
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
