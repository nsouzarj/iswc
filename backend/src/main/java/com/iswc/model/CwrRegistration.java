package com.iswc.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "cwr_registrations")
public class CwrRegistration {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @NotBlank(message = "Filename is required")
    @Size(max = 100, message = "Filename cannot exceed 100 characters")
    @Column(name = "filename", unique = true, nullable = false, length = 100)
    private String filename;

    @NotBlank(message = "Status is required")
    @Pattern(regexp = "^(SUBMITTED|ACCEPTED|REJECTED|ACK_RECEIVED)$", message = "Status must be SUBMITTED, ACCEPTED, REJECTED, or ACK_RECEIVED")
    @Column(name = "status", nullable = false, length = 20)
    private String status = "SUBMITTED";

    @NotBlank(message = "CWR content is required")
    @Column(name = "cwr_content", nullable = false, columnDefinition = "TEXT")
    private String cwrContent;

    @Column(name = "created_at", nullable = false, updatable = false, insertable = false)
    private OffsetDateTime createdAt;

    @Column(name = "updated_at", nullable = false, insertable = false)
    private OffsetDateTime updatedAt;

    // Constructors
    public CwrRegistration() {
    }

    public CwrRegistration(String filename, String status, String cwrContent) {
        this.filename = filename;
        this.status = status;
        this.cwrContent = cwrContent;
    }

    // Getters and Setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getFilename() {
        return filename;
    }

    public void setFilename(String filename) {
        this.filename = filename;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getCwrContent() {
        return cwrContent;
    }

    public void setCwrContent(String cwrContent) {
        this.cwrContent = cwrContent;
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
