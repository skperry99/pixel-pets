package org.example.backend.service;

import org.example.backend.model.Pet;
import org.example.backend.model.User;
import org.example.backend.repository.PetRepository;
import org.springframework.stereotype.Service;

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
}
