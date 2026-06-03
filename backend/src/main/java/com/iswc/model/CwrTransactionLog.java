package com.iswc.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "cwr_transaction_logs")
public class CwrTransactionLog {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @NotNull(message = "Associated CWR registration is required")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "registration_id", nullable = false)
    private CwrRegistration registration;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "work_id")
    private MusicalWork work;

    @NotBlank(message = "Transaction type is required")
    @Size(max = 3, message = "Transaction type cannot exceed 3 characters")
    @Column(name = "transaction_type", nullable = false, length = 3)
    private String transactionType;

    @NotBlank(message = "Status code is required")
    @Size(max = 2, message = "Status code cannot exceed 2 characters")
    @Column(name = "status_code", nullable = false, length = 2)
    private String statusCode;

    @Column(name = "raw_log", columnDefinition = "TEXT")
    private String rawLog;

    @Column(name = "created_at", nullable = false, updatable = false, insertable = false)
    private OffsetDateTime createdAt;

    // Constructors
    public CwrTransactionLog() {
    }

    public CwrTransactionLog(CwrRegistration registration, MusicalWork work, String transactionType, String statusCode, String rawLog) {
        this.registration = registration;
        this.work = work;
        this.transactionType = transactionType;
        this.statusCode = statusCode;
        this.rawLog = rawLog;
    }

    // Getters and Setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public CwrRegistration getRegistration() {
        return registration;
    }

    public void setRegistration(CwrRegistration registration) {
        this.registration = registration;
    }

    public MusicalWork getWork() {
        return work;
    }

    public void setWork(MusicalWork work) {
        this.work = work;
    }

    public String getTransactionType() {
        return transactionType;
    }

    public void setTransactionType(String transactionType) {
        this.transactionType = transactionType;
    }

    public String getStatusCode() {
        return statusCode;
    }

    public void setStatusCode(String statusCode) {
        this.statusCode = statusCode;
    }

    public String getRawLog() {
        return rawLog;
    }

    public void setRawLog(String rawLog) {
        this.rawLog = rawLog;
    }

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(OffsetDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
