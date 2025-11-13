package org.example.backend.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

/**
 * Pet data transfer object (API shape). - Keeps API backward-compatible: accepts "hunger" but
 * returns "fullness". - Allows nullable stats so the server can apply sensible defaults.
 */
@Getter
@Setter
public class PetDto {

    // ===== Identity =====
    private Long id;

    // ===== Basic info =====
    @NotBlank
    @Size(min = 2, max = 50)
    private String name;

    @NotBlank
    private String type; // cat, dog, dragon, etc.

    /**
     * Pet level; nullable so server can default (e.g., to 1) when omitted.
     */
    private Integer level;

    // ===== Stats (0–100) =====
    /**
     * Output as "fullness"; still accepts legacy "hunger" on input.
     */
    @JsonProperty("fullness")
    @JsonAlias("hunger")
    @Min(0)
    @Max(100)
    private Integer fullness;

    @Min(0)
    @Max(100)
    private Integer happiness;

    @Min(0)
    @Max(100)
    private Integer energy;

    // ===== Ownership =====
    private Long userId;

    // ===== Constructors =====
    public PetDto() {
        /* for Jackson */
    }

    public PetDto(
            Long id,
            String name,
            String type,
            Integer level,
            Integer fullness,
            Integer happiness,
            Integer energy,
            Long userId) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.level = level;
        this.fullness = fullness;
        this.happiness = happiness;
        this.energy = energy;
        this.userId = userId;
    }
}
