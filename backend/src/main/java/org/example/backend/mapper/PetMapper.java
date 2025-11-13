package org.example.backend.mapper;

import org.example.backend.dto.PetDto;
import org.example.backend.model.Pet;
import org.example.backend.model.User;

/**
 * Maps between Pet entities and PetDto API objects. - Uses safe defaults when DTO omits stats/level
 * - Does not touch server-managed fields like lastTickAt
 */
public final class PetMapper {

  // Prevent instantiation
  private PetMapper() {}

  // ===== Entity -> DTO =====

  /** Convert a Pet entity to API-safe PetDto. */
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
   * Build a new Pet entity from a DTO and its owner. Applies sensible defaults when fields are
   * missing.
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
