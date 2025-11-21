package org.example.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

/**
 * Request body for adopting a pet via {@code POST /api/pets/adopt}.
 *
 * <p>Validation:
 * <ul>
 *   <li>{@code name}: required, 2–50 characters</li>
 *   <li>{@code type}: required (pet type/species)</li>
 *   <li>{@code userId}: required (owning user)</li>
 * </ul>
 */
@Setter
@Getter
public class AdoptPetRequest {

    /** Pet name shown in the UI. */
    @NotBlank
    @Size(min = 2, max = 50)
    private String name;

    /** Pet type/species (e.g., "cat", "dog", "slime"). */
    @NotBlank
    private String type;

    /** Owning user's id; must be present so we don't 500 on null. */
    @NotNull
    private Long userId;
}
