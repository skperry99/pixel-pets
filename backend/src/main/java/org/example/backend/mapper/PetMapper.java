package org.example.backend.mapper;

import org.example.backend.dto.PetDto;
import org.example.backend.model.Pet;
import org.example.backend.model.User;

/**
 * Maps between Pet entities and PetDto API objects.
 *
 * <p>Responsibilities:
 * <ul>
 *   <li>Convert JPA entities to API-safe DTOs.</li>
 *   <li>Build new Pet entities from DTOs using sensible defaults when
 *       stats/level are omitted.</li>
 *   <li>Avoid touching server-managed fields like {@code lastTickAt}.</li>
 * </ul>
 */
public final class PetMapper {

    // Prevent instantiation
    private PetMapper() {}

    // ===== Entity -> DTO =====

    /** Convert a Pet entity to an API-facing PetDto. */
    public static PetDto toPetDto(Pet pet) {
        Long userId = (pet.getUser() != null) ? pet.getUser().getId() : null;

        return new PetDto(
                pet.getId(),
                pet.getName(),
                pet.getType(),
                pet.getLevel(),
                pet.getFullness(),
                pet.getHappiness(),
                pet.getEnergy(),
                userId);
    }

    // ===== DTO -> Entity (create) =====

    /**
     * Build a new Pet entity from a DTO and its owner.
     *
     * <p>Notes:
     * <ul>
     *   <li>If the DTO provides an id, it is copied (for update flows).</li>
     *   <li>Level and stats are nullable in the DTO; missing values are defaulted
     *       (e.g., level 1, 80/80/80 for stats).</li>
     *   <li>Owner is required and injected as a {@link User} entity.</li>
     *   <li>{@code lastTickAt} is not managed here; it is set by {@code @PrePersist}
     *       and/or the service layer.</li>
     * </ul>
     */
    public static Pet toEntity(PetDto dto, User owner) {
        Pet pet = new Pet();

        if (dto.getId() != null) {
            pet.setId(dto.getId());
        }

        pet.setName(dto.getName());
        pet.setType(dto.getType());

        // Level & stats (nullable in DTO → default if missing)
        pet.setLevel(defaultOr(dto.getLevel(), 1));
        pet.setFullness(defaultOr(dto.getFullness(), 80));
        pet.setHappiness(defaultOr(dto.getHappiness(), 80));
        pet.setEnergy(defaultOr(dto.getEnergy(), 80));

        pet.setUser(owner);
        // lastTickAt is set by @PrePersist; service may also initialize

        return pet;
    }

    // ===== Helpers =====

    /** Return value if not null, otherwise the provided default. */
    private static int defaultOr(Integer value, int fallback) {
        return (value != null) ? value : fallback;
    }
}
