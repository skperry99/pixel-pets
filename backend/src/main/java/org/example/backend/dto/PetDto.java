package org.example.backend.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

/**
 * Pet data transfer object (API shape).
 *
 * <p>Responsibilities:
 * <ul>
 *   <li>Defines the JSON contract for pet resources.</li>
 *   <li>Keeps API backward-compatible by accepting {@code "hunger"} but returning {@code "fullness"}.</li>
 *   <li>Allows nullable stats so the server can apply sensible defaults when omitted.</li>
 * </ul>
 */
@Getter
@Setter
public class PetDto {

    // ===== Identity =====

    /** Surrogate primary key of the pet (nullable when creating). */
    private Long id;

    // ===== Basic info =====

    /** Display name for the pet. */
    @NotBlank
    @Size(min = 2, max = 50)
    private String name;

    /** Pet type/species (e.g., cat, dog, dragon). */
    @NotBlank
    private String type;

    /** Pet level; nullable so the server can default (e.g. to 1) when omitted. */
    private Integer level;

    // ===== Stats (0–100) =====

    /**
     * Fullness stat in the range [0, 100].
     *
     * <p>Serialized as {@code "fullness"} but still accepts legacy {@code "hunger"} on input for
     * backward compatibility.
     */
    @JsonProperty("fullness")
    @JsonAlias("hunger")
    @Min(0)
    @Max(100)
    private Integer fullness;

    /** Happiness stat in the range [0, 100]. */
    @Min(0)
    @Max(100)
    private Integer happiness;

    /** Energy stat in the range [0, 100]. */
    @Min(0)
    @Max(100)
    private Integer energy;

    // ===== Ownership =====

    /** Owning user's id; required for adopt/create flows. */
    private Long userId;

    // ===== Constructors =====

    /** No-args constructor for Jackson and frameworks. */
    public PetDto() {
        // for Jackson
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
