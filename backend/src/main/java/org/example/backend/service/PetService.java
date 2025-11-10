package org.example.backend.service;

import org.example.backend.model.Pet;
import org.example.backend.model.User;
import org.example.backend.repository.PetRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class PetService {
    private final PetRepository petRepository;

    // --- Decay tuning knobs ---
    private static final double FULLNESS_DECAY_PER_MIN = 0.20;   // fullness goes DOWN over time
    private static final double ENERGY_DECAY_PER_MIN = 0.10;
    private static final double HAPPINESS_DECAY_PER_MIN = 0.05;

    private static final double HAPPINESS_PENALTY_FULLNESS_LOW_PER_MIN = 0.15; // if fullness < 30
    private static final double HAPPINESS_PENALTY_ENERGY_LOW_PER_MIN = 0.10; // if energy < 30
    private static final double HAPPINESS_BONUS_WELL_CARED_PER_MIN = 0.05; // if fullness>70 && energy>70

    // Caps
    private static final long MAX_MINUTES_PER_TICK = 24 * 60;          // cap per tick
    private static final long MAX_BACKDATED_MINUTES = 3L * 24 * 60;    // 0 = no cap; here: 3 days

    public PetService(PetRepository petRepository) {
        this.petRepository = petRepository;
    }

    // ---------- Helpers ----------
    private int clamp(int value) {
        return (value < 0) ? 0 : Math.min(value, 100);
    }

    private Pet requirePet(Long id) {
        return petRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Pet not found: " + id));
    }

    // Apply time-based stat changes since lastTickAt, then stamp now.
    private void tick(Pet pet) {
        Instant now = Instant.now();
        Instant last = pet.getLastTickAt();
        if (last == null) {
            pet.setLastTickAt(now);
            return;
        }

        long rawMinutes = Math.max(0, ChronoUnit.MINUTES.between(last, now));

        // Optional total cap across long absences; 0 means "no cap"
        long cappedRaw = (MAX_BACKDATED_MINUTES > 0)
                ? Math.min(rawMinutes, MAX_BACKDATED_MINUTES)
                : rawMinutes;

        // Per-tick cap (prevents a single tick from applying more than 24h)
        long minutes = Math.min(cappedRaw, MAX_MINUTES_PER_TICK);
        if (minutes == 0) {
            return; // less than a minute elapsed; skip
        }

        double fullness = pet.getFullness();
        double energy = pet.getEnergy();
        double happiness = pet.getHappiness();

        // Natural decay
        fullness -= FULLNESS_DECAY_PER_MIN * minutes;
        energy -= ENERGY_DECAY_PER_MIN * minutes;
        happiness -= HAPPINESS_DECAY_PER_MIN * minutes;

        // Conditional mood effects
        if (fullness < 30) happiness -= HAPPINESS_PENALTY_FULLNESS_LOW_PER_MIN * minutes;
        if (energy < 30) happiness -= HAPPINESS_PENALTY_ENERGY_LOW_PER_MIN * minutes;
        if (fullness > 70 && energy > 70) happiness += HAPPINESS_BONUS_WELL_CARED_PER_MIN * minutes;

        // Clamp and write back
        pet.setFullness(clamp((int) Math.round(fullness)));
        pet.setEnergy(clamp((int) Math.round(energy)));
        pet.setHappiness(clamp((int) Math.round(happiness)));
        pet.setLastTickAt(now);
    }

    // ---------- Read methods ----------
    public List<Pet> getAllPets() {
        List<Pet> pets = petRepository.findAll();
        pets.forEach(this::tick);
        return petRepository.saveAll(pets);
    }

    public Pet getPetById(Long id) {
        Pet pet = petRepository.findById(id).orElse(null);
        if (pet != null) {
            tick(pet);
            pet = petRepository.save(pet);
        }
        return pet;
    }

    public List<Pet> getPetsByUserId(Long userId) {
        List<Pet> pets = petRepository.findByUserId(userId);
        pets.forEach(this::tick);
        return petRepository.saveAll(pets);
    }

    // ---------- Write methods ----------
    public Pet savePet(Pet pet) {
        tick(pet);
        return petRepository.save(pet);
    }

    public Pet createPetForUser(String name, String type, User user) {
        Pet pet = new Pet(name, type);
        pet.setUser(user);
        pet.setLastTickAt(Instant.now());
        // Optionally initialize:
        // pet.setFullness(80); pet.setEnergy(80); pet.setHappiness(80);
        return petRepository.save(pet);
    }

    @Transactional
    public Pet feedPet(Long petId) {
        Pet pet = requirePet(petId);
        tick(pet);
        pet.setFullness(clamp(pet.getFullness() + 20));
        pet.setHappiness(clamp(pet.getHappiness() + 5));
        return petRepository.save(pet);
    }

    @Transactional
    public Pet playWithPet(Long petId) {
        Pet pet = requirePet(petId);
        tick(pet);
        pet.setFullness(clamp(pet.getFullness() - 10));
        pet.setHappiness(clamp(pet.getHappiness() + 15));
        pet.setEnergy(clamp(pet.getEnergy() - 10));
        return petRepository.save(pet);
    }

    @Transactional
    public Pet restPet(Long petId) {
        Pet pet = requirePet(petId);
        tick(pet);
        pet.setFullness(clamp(pet.getFullness() - 5));
        pet.setHappiness(clamp(pet.getHappiness() + 2));
        pet.setEnergy(clamp(pet.getEnergy() + 25));
        return petRepository.save(pet);
    }

    public void deletePet(Long id) {
        if (!petRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Pet not found: " + id);
        }
        petRepository.deleteById(id);
    }
}
