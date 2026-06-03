package com.iswc.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "musical_works")
public class MusicalWork {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(name = "iswc", unique = true, length = 11)
    @Pattern(regexp = "^T\\d{9}\\d$", message = "ISWC must be in standard format (T followed by 10 digits)")
    private String iswc;

    @NotBlank(message = "Title is required")
    @Size(max = 60, message = "Title cannot exceed 60 characters")
    @Column(name = "title", nullable = false, length = 60)
    private String title;

    @Size(min = 2, max = 2, message = "Language code must be exactly 2 characters")
    @Pattern(regexp = "^[A-Z]{2}$", message = "Language code must be 2 uppercase letters")
    @Column(name = "language_code", length = 2)
    private String languageCode = "EN";

    @Size(min = 3, max = 3, message = "Musical genre must be exactly 3 characters")
    @Column(name = "musical_genre", length = 3)
    private String musicalGenre;

    @NotBlank(message = "Status is required")
    @Pattern(regexp = "^(ACTIVE|CONFLICT|DRAFT)$", message = "Status must be ACTIVE, CONFLICT, or DRAFT")
    @Column(name = "status", nullable = false, length = 20)
    private String status = "ACTIVE";

    @Column(name = "created_at", nullable = false, updatable = false, insertable = false)
    private OffsetDateTime createdAt;

    @Column(name = "updated_at", nullable = false, insertable = false)
    private OffsetDateTime updatedAt;

    // Constructors
    public MusicalWork() {
    }

    public MusicalWork(String iswc, String title, String languageCode, String musicalGenre, String status) {
        this.iswc = iswc;
        this.title = title;
        this.languageCode = languageCode;
        this.musicalGenre = musicalGenre;
        this.status = status;
    }

    // Getters and Setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getIswc() {
        return iswc;
    }

    public void setIswc(String iswc) {
        this.iswc = iswc;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getLanguageCode() {
        return languageCode;
    }

    public void setLanguageCode(String languageCode) {
        this.languageCode = languageCode;
    }

    public String getMusicalGenre() {
        return musicalGenre;
    }

    public void setMusicalGenre(String musicalGenre) {
        this.musicalGenre = musicalGenre;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
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
