package com.iswc.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "recordings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Recording {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @NotBlank(message = "ISRC is required")
    @Pattern(regexp = "^[A-Z]{2}[A-Z0-9]{3}\\d{2}\\d{5}$", message = "ISRC must match standard format (e.g. BR-ABC-23-00001 clean: BRABC2300001)")
    @Column(name = "isrc", unique = true, nullable = false, length = 12)
    private String isrc;

    @NotNull(message = "Associated musical work is required")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "work_id", nullable = false)
    private MusicalWork work;

    @NotBlank(message = "Title is required")
    @Size(max = 100, message = "Title cannot exceed 100 characters")
    @Column(name = "title", nullable = false, length = 100)
    private String title;

    @NotNull(message = "Duration in seconds is required")
    @Min(value = 1, message = "Duration must be greater than 0")
    @Column(name = "duration_seconds", nullable = false)
    private Integer durationSeconds;

    @Column(name = "created_at", nullable = false, updatable = false, insertable = false)
    private OffsetDateTime createdAt;

    @Column(name = "updated_at", nullable = false, insertable = false)
    private OffsetDateTime updatedAt;

    // Custom constructor excluding system fields
    public Recording(String isrc, MusicalWork work, String title, Integer durationSeconds) {
        this.isrc = isrc;
        this.work = work;
        this.title = title;
        this.durationSeconds = durationSeconds;
    }
}
