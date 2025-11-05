package org.example.backend.service;

import org.example.backend.model.Pet;
import org.example.backend.model.User;
import org.example.backend.repository.PetRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class PetService {
    private final PetRepository petRepository;

    public PetService(PetRepository petRepository) {
        this.petRepository = petRepository;
    }

    public List<Pet> getAllPets() {
        return petRepository.findAll();
    }

    public Pet getPetById(Long id) {
        return petRepository.findById(id).orElse(null);
    }

    public List<Pet> getPetsByUserId(Long userId) {
        return petRepository.findByUserId(userId);
    }

    public Pet savePet(Pet pet) {
        return petRepository.save(pet);
    }

    public Pet createPetForUser(String name, String type, User user) {
        Pet pet = new Pet(name, type);
        pet.setUser(user);
        return petRepository.save(pet);
    }

    private int clamp(int value) {
        if (value < 0) return 0;
        if (value > 100) return 100;
        return value;
    }

    public Pet feedPet(Long petId) {
        Pet pet = petRepository.findById(petId).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Pet not found"));

        // Increase hunger level by 20, happiness by 5, energy unchanged, capped at 100
        pet.setHunger(clamp(pet.getHunger() + 20));
        pet.setHappiness(clamp(pet.getHappiness() + 5));

        return petRepository.save(pet);
    }
}
