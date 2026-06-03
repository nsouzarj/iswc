package com.iswc.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "work_rightsholders", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"work_id", "rightsholder_id", "role"})
})
public class WorkRightsholder {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @NotNull(message = "Work is required")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "work_id", nullable = false)
    @JsonIgnore
    private MusicalWork work;

    @NotNull(message = "Rightsholder is required")
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "rightsholder_id", nullable = false)
    private Rightsholder rightsholder;

    @NotBlank(message = "Role is required")
    @Pattern(regexp = "^[A-Z]{2}$", message = "Role must be exactly 2 uppercase letters (e.g. CA, AR, E)")
    @Column(name = "role", nullable = false, length = 2)
    private String role;

    @NotNull(message = "Mechanical split is required")
    @DecimalMin(value = "0.00", message = "Mechanical split must be at least 0.00%")
    @DecimalMax(value = "100.00", message = "Mechanical split cannot exceed 100.00%")
    @Column(name = "mechanical_split", nullable = false, precision = 5, scale = 2)
    private BigDecimal mechanicalSplit = BigDecimal.ZERO;

    @NotNull(message = "Performance split is required")
    @DecimalMin(value = "0.00", message = "Performance split must be at least 0.00%")
    @DecimalMax(value = "100.00", message = "Performance split cannot exceed 100.00%")
    @Column(name = "performance_split", nullable = false, precision = 5, scale = 2)
    private BigDecimal performanceSplit = BigDecimal.ZERO;

    @NotNull(message = "Publisher split is required")
    @DecimalMin(value = "0.00", message = "Publisher split must be at least 0.00%")
    @DecimalMax(value = "100.00", message = "Publisher split cannot exceed 100.00%")
    @Column(name = "publisher_split", nullable = false, precision = 5, scale = 2)
    private BigDecimal publisherSplit = BigDecimal.ZERO;

    @Column(name = "created_at", nullable = false, updatable = false, insertable = false)
    private OffsetDateTime createdAt;

    @Column(name = "updated_at", nullable = false, insertable = false)
    private OffsetDateTime updatedAt;

    // Constructors
    public WorkRightsholder() {
    }

    public WorkRightsholder(MusicalWork work, Rightsholder rightsholder, String role, BigDecimal mechanicalSplit, BigDecimal performanceSplit, BigDecimal publisherSplit) {
        this.work = work;
        this.rightsholder = rightsholder;
        this.role = role;
        this.mechanicalSplit = mechanicalSplit;
        this.performanceSplit = performanceSplit;
        this.publisherSplit = publisherSplit;
    }

    // Getters and Setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public MusicalWork getWork() {
        return work;
    }

    public void setWork(MusicalWork work) {
        this.work = work;
    }

    public Rightsholder getRightsholder() {
        return rightsholder;
    }

    public void setRightsholder(Rightsholder rightsholder) {
        this.rightsholder = rightsholder;
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

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(OffsetDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public OffsetDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(OffsetDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
