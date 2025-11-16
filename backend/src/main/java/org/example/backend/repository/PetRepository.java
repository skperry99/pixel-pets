package org.example.backend.repository;

import java.util.List;
import org.example.backend.model.Pet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for {@link Pet} entities.
 *
 * <p>Provides basic CRUD operations plus helpers to query by owner.
 */
@Repository
public interface PetRepository extends JpaRepository<Pet, Long> {

    /**
     * Find all pets owned by the given user.
     *
     * @param userId ID of the owning {@link org.example.backend.model.User}
     * @return list of pets belonging to that user
     */
    List<Pet> findByUserId(Long userId);
}
