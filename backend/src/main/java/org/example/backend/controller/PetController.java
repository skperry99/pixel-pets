package org.example.backend.controller;

import java.util.List;

import org.example.backend.dto.AdoptPetRequest;
import org.example.backend.dto.PetDto;
import org.example.backend.mapper.PetMapper;
import org.example.backend.model.Pet;
import org.example.backend.model.User;
import org.example.backend.service.PetService;
import org.example.backend.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

/**
 * REST controller for Pet resources (CRUD + actions). Routes under /api/pets; CORS allowed from the
 * Vite dev server.
 */
@RestController
@RequestMapping("/api/pets")
@CrossOrigin(origins = "http://localhost:5173") // adjust via config for prod
public class PetController {

    // ----- Dependencies -----
    private final PetService petService;
    private final UserService userService;

    public PetController(PetService petService, UserService userService) {
        this.petService = petService;
        this.userService = userService;
    }

    // ===== Read =====

    /**
     * GET /api/pets Returns all pets as DTOs.
     */
    @GetMapping
    public List<PetDto> getAllPets() {
        return petService.getAllPets().stream().map(PetMapper::toPetDto).toList();
    }

    /**
     * GET /api/pets/{id} Returns a single pet by id, or 404 if not found.
     */
    @GetMapping("/{id}")
    public PetDto getPetById(@PathVariable Long id) {
        Pet pet = petService.getPetById(id);
        if (pet == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Pet not found: " + id);
        }
        return PetMapper.toPetDto(pet);
    }

    /**
     * GET /api/pets/user/{userId} Returns all pets belonging to a user.
     */
    @GetMapping("/user/{userId}")
    public List<PetDto> getPetsByUserId(@PathVariable Long userId) {
        return petService.getPetsByUserId(userId).stream().map(PetMapper::toPetDto).toList();
    }

    // ===== Create / Adopt =====

    /**
     * POST /api/pets Creates a pet from a DTO; requires a valid userId inside the DTO. Returns 201
     * Created with the saved pet DTO.
     */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PetDto createPet(@RequestBody PetDto petDto) {
        // Ensure owner exists
        User owner = userService.getUserById(petDto.getUserId());
        if (owner == null) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "User not found: " + petDto.getUserId());
        }

        // Map DTO -> Entity, attach owner, persist, map back -> DTO
        Pet toSave = PetMapper.toEntity(petDto, owner);
        Pet saved = petService.savePet(toSave);
        return PetMapper.toPetDto(saved);
    }

    /**
     * POST /api/pets/adopt Convenience endpoint to adopt a new pet by name/type for a given user.
     * Returns 201 Created with the new pet DTO.
     */
    @PostMapping("/adopt")
    @ResponseStatus(HttpStatus.CREATED)
    public PetDto adoptPet(@RequestBody AdoptPetRequest request) {
        // Ensure owner exists
        User owner = userService.getUserById(request.getUserId());
        if (owner == null) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "User not found: " + request.getUserId());
        }

        // Create + save, then map to DTO
        Pet adopted = petService.createPetForUser(request.getName(), request.getType(), owner);
        return PetMapper.toPetDto(adopted);
    }

    // ===== Actions (state changes) =====

    /**
     * POST /api/pets/{id}/feed Feeds the pet and returns the updated DTO.
     */
    @PostMapping("/{id}/feed")
    public PetDto feed(@PathVariable Long id) {
        Pet pet = petService.feedPet(id);
        return PetMapper.toPetDto(pet);
    }

    /**
     * POST /api/pets/{id}/play Plays with the pet and returns the updated DTO.
     */
    @PostMapping("/{id}/play")
    public PetDto play(@PathVariable Long id) {
        Pet pet = petService.playWithPet(id);
        return PetMapper.toPetDto(pet);
    }

    /**
     * POST /api/pets/{id}/rest Rests the pet and returns the updated DTO.
     */
    @PostMapping("/{id}/rest")
    public PetDto rest(@PathVariable Long id) {
        Pet pet = petService.restPet(id);
        return PetMapper.toPetDto(pet);
    }

    // ===== Delete =====

    /**
     * DELETE /api/pets/{id} Deletes a pet. Returns 204 No Content.
     */
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletePet(@PathVariable Long id) {
        petService.deletePet(id);
    }
}
