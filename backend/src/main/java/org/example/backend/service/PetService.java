package org.example.backend.service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import org.example.backend.model.Pet;
import org.example.backend.model.User;
import org.example.backend.repository.PetRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

/**
 * Domain service for {@link Pet} logic.
 *
 * <p>Responsibilities:
 * <ul>
 *   <li>Apply “lazy ticking” time-based stat decay on reads/writes</li>
 *   <li>Handle simple actions (feed, play, rest) and stat mutations with clamping</li>
 *   <li>Enforce per-tick and total backdated caps to avoid extreme jumps</li>
 * </ul>
 */
@Service
public class PetService {

    // ===== Dependencies =====

    private final PetRepository petRepository;

    public PetService(PetRepository petRepository) {
        this.petRepository = petRepository;
    }

    // ===== Tuning knobs (decay & caps) =====

    // Natural per-minute decay (higher = faster drift)
    private static final double FULLNESS_DECAY_PER_MIN = 0.20; // fullness goes DOWN over time
    private static final double ENERGY_DECAY_PER_MIN = 0.10;
    private static final double HAPPINESS_DECAY_PER_MIN = 0.05;

    // Conditional mood effects (per minute)
    private static final double HAPPINESS_PENALTY_FULLNESS_LOW_PER_MIN = 0.15; // fullness < 30
    private static final double HAPPINESS_PENALTY_ENERGY_LOW_PER_MIN = 0.10;   // energy   < 30
    private static final double HAPPINESS_BONUS_WELL_CARED_PER_MIN = 0.05;    // fullness>70 && energy>70

    // Decay caps
    private static final long MAX_MINUTES_PER_TICK =
            24 * 60; // at most 24h of decay per single tick()
    private static final long MAX_BACKDATED_MINUTES =
            3L * 24 * 60; // total cap during long absences (0 = no cap)

    // ===== Helpers =====

    /** Clamp a stat value into the [0, 100] range. */
    private int clamp(int value) {
        return (value < 0) ? 0 : Math.min(value, 100);
    }

    /** Look up a pet or throw a 404 NOT_FOUND. */
    private Pet requirePet(Long id) {
        return petRepository
                .findById(id)
                .orElseThrow(
                        () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Pet not found: " + id));
    }

    /**
     * Apply time-based decay since {@code lastTickAt}, then stamp {@code now}.
     *
     * <p>Uses:
     * <ul>
     *   <li>A total backdated cap ({@link #MAX_BACKDATED_MINUTES}) for very long absences</li>
     *   <li>A per-tick cap ({@link #MAX_MINUTES_PER_TICK}) to avoid large single jumps</li>
     * </ul>
     *
     * @param pet pet to update
     * @return {@code true} if any stat or the lastTickAt timestamp changed
     */
    private boolean tick(Pet pet) {
        Instant now = Instant.now();
        Instant last = pet.getLastTickAt();
        if (last == null) { // first touch
            pet.setLastTickAt(now);
            return true;
        }

        long rawMinutes = Math.max(0, ChronoUnit.MINUTES.between(last, now));

        // Cap total backdated minutes (e.g., long absences)
        long cappedRaw =
                (MAX_BACKDATED_MINUTES > 0) ? Math.min(rawMinutes, MAX_BACKDATED_MINUTES) : rawMinutes;

        // Cap per-tick minutes (avoid huge single jumps)
        long minutes = Math.min(cappedRaw, MAX_MINUTES_PER_TICK);
        if (minutes == 0) {
            return false; // nothing to change
        }

        // Current values
        double fullness = pet.getFullness();
        double energy = pet.getEnergy();
        double happiness = pet.getHappiness();

        // Base decay
        fullness -= FULLNESS_DECAY_PER_MIN * minutes;
        energy -= ENERGY_DECAY_PER_MIN * minutes;
        happiness -= HAPPINESS_DECAY_PER_MIN * minutes;

        // Conditional mood effects
        if (fullness < 30) happiness -= HAPPINESS_PENALTY_FULLNESS_LOW_PER_MIN * minutes;
        if (energy < 30) happiness -= HAPPINESS_PENALTY_ENERGY_LOW_PER_MIN * minutes;
        if (fullness > 70 && energy > 70) happiness += HAPPINESS_BONUS_WELL_CARED_PER_MIN * minutes;

        // Round, clamp, and detect changes
        int newFullness = clamp((int) Math.round(fullness));
        int newEnergy = clamp((int) Math.round(energy));
        int newHappiness = clamp((int) Math.round(happiness));

        boolean changed =
                (newFullness != pet.getFullness())
                        || (newEnergy != pet.getEnergy())
                        || (newHappiness != pet.getHappiness())
                        || (pet.getLastTickAt() == null)
                        || !now.equals(pet.getLastTickAt());

        // Write back
        pet.setFullness(newFullness);
        pet.setEnergy(newEnergy);
        pet.setHappiness(newHappiness);
        pet.setLastTickAt(now);

        return changed;
    }

    // ===== Read methods (apply lazy tick) =====

    /**
     * Load all pets, lazily apply decay via {@link #tick(Pet)}, and persist the drift if anything
     * changed.
     */
    public List<Pet> getAllPets() {
        List<Pet> pets = petRepository.findAll();
        boolean anyChanged = false;
        for (Pet p : pets) anyChanged |= tick(p);
        if (anyChanged) petRepository.saveAll(pets);
        return pets;
    }

    /**
     * Load a single pet by id, apply a tick, and persist if stats changed.
     *
     * @return the pet, or {@code null} if not found
     */
    public Pet getPetById(Long id) {
        Pet pet = petRepository.findById(id).orElse(null);
        if (pet != null && tick(pet)) {
            pet = petRepository.save(pet);
        }
        return pet;
    }

    /**
     * Load all pets for a given user, apply ticking, and persist any changes.
     *
     * @param userId owner id
     * @return list of pets for that user
     */
    public List<Pet> getPetsByUserId(Long userId) {
        List<Pet> pets = petRepository.findByUserId(userId);
        boolean anyChanged = false;
        for (Pet p : pets) anyChanged |= tick(p);
        if (anyChanged) petRepository.saveAll(pets);
        return pets;
    }

    // ===== Write methods =====

    /**
     * Save a pet after applying a tick, so the latest time-based drift is persisted together with any
     * explicit edits.
     */
    public Pet savePet(Pet pet) {
        tick(pet);
        return petRepository.save(pet); // still persist explicit edits
    }

    /**
     * Create a new pet for a user with an initial timestamp.
     *
     * @param name pet name
     * @param type pet type (species/variant)
     * @param user owner
     */
    public Pet createPetForUser(String name, String type, User user) {
        Pet pet = new Pet(name, type);
        pet.setUser(user);
        pet.setLastTickAt(Instant.now());

        return petRepository.save(pet);
    }

    // ===== Actions =====

    /**
     * Feed the pet: increases fullness and slightly improves happiness, after applying a tick.
     */
    @Transactional
    public Pet feedPet(Long petId) {
        Pet pet = requirePet(petId);
        tick(pet);
        pet.setFullness(clamp(pet.getFullness() + 20));
        pet.setHappiness(clamp(pet.getHappiness() + 5));
        return petRepository.save(pet);
    }

    /**
     * Play with the pet: increases happiness, but costs some fullness and energy, after applying a
     * tick.
     */
    @Transactional
    public Pet playWithPet(Long petId) {
        Pet pet = requirePet(petId);
        tick(pet);
        pet.setFullness(clamp(pet.getFullness() - 10));
        pet.setHappiness(clamp(pet.getHappiness() + 15));
        pet.setEnergy(clamp(pet.getEnergy() - 10));
        return petRepository.save(pet);
    }

    /**
     * Rest the pet: restores energy, small happiness boost, and a bit of fullness decay, after
     * applying a tick.
     */
    @Transactional
    public Pet restPet(Long petId) {
        Pet pet = requirePet(petId);
        tick(pet);
        pet.setFullness(clamp(pet.getFullness() - 5));
        pet.setHappiness(clamp(pet.getHappiness() + 2));
        pet.setEnergy(clamp(pet.getEnergy() + 25));
        return petRepository.save(pet);
    }

    // ===== Delete =====

    /**
     * Delete a pet by id. Throws 404 if the pet does not exist.
     */
    public void deletePet(Long id) {
        if (!petRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Pet not found: " + id);
        }
        petRepository.deleteById(id);
    }
}
