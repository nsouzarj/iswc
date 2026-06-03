package com.iswc.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "rightsholders")
public class Rightsholder {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(name = "ipi_name_number", unique = true, length = 11)
    @Pattern(regexp = "^\\d{11}$", message = "IPI must be exactly 11 numeric digits")
    private String ipiNameNumber;

    @Column(name = "isni", unique = true, length = 16)
    @Pattern(regexp = "^[0-9]{15}[0-9X]$", message = "ISNI must be exactly 16 characters (15 digits followed by a digit or X)")
    private String isni;

    @NotBlank(message = "Full name is required")
    @Size(max = 100, message = "Full name cannot exceed 100 characters")
    @Column(name = "full_name", nullable = false, length = 100)
    private String fullName;

    @Email(message = "Invalid email format")
    @Size(max = 255, message = "Email cannot exceed 255 characters")
    @Column(name = "email", unique = true, length = 255)
    private String email;

    @Column(name = "created_at", nullable = false, updatable = false, insertable = false)
    private OffsetDateTime createdAt;

    @Column(name = "updated_at", nullable = false, insertable = false)
    private OffsetDateTime updatedAt;

    // Constructors
    public Rightsholder() {
    }

    public Rightsholder(String ipiNameNumber, String isni, String fullName, String email) {
        this.ipiNameNumber = ipiNameNumber;
        this.isni = isni;
        this.fullName = fullName;
        this.email = email;
    }

    // Getters and Setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getIpiNameNumber() {
        return ipiNameNumber;
    }

    public void setIpiNameNumber(String ipiNameNumber) {
        this.ipiNameNumber = ipiNameNumber;
    }

    public String getIsni() {
        return isni;
    }

    public void setIsni(String isni) {
        this.isni = isni;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
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
