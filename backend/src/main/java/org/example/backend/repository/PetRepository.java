package org.example.backend.repository;

import java.util.List;
import org.example.backend.model.Pet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PetRepository extends JpaRepository<Pet, Long> {
  List<Pet> findByUserId(Long ownerId);
}
