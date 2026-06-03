package com.iswc.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "cwr_registrations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
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

    // Custom constructor excluding system fields
    public CwrRegistration(String filename, String status, String cwrContent) {
        this.filename = filename;
        this.status = status;
        this.cwrContent = cwrContent;
    }
}
