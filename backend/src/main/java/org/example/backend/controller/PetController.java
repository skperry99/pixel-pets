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
 * REST controller for pet resources (CRUD operations and pet actions).
 *
 * <p>All endpoints are routed under {@code /api/pets}.
 */
@RestController
@RequestMapping("/api/pets")
public class PetController {

    // ===== Dependencies =====

    private final PetService petService;
    private final UserService userService;

    public PetController(PetService petService, UserService userService) {
        this.petService = petService;
        this.userService = userService;
    }

    // ===== Read =====

    /**
     * GET /api/pets
     *
     * <p>Returns all pets as DTOs.
     *
     * @return list of all pets
     */
    @GetMapping
    public List<PetDto> getAllPets() {
        return petService.getAllPets().stream().map(PetMapper::toPetDto).toList();
    }

    /**
     * GET /api/pets/{id}
     *
     * <p>Returns a single pet by id, or 404 if not found.
     *
     * @param id pet id
     * @return pet DTO
     * @throws ResponseStatusException with 404 if the pet is not found
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
     * GET /api/pets/user/{userId}
     *
     * <p>Returns all pets belonging to a given user.
     *
     * @param userId owner user id
     * @return list of pet DTOs owned by the user
     */
    @GetMapping("/user/{userId}")
    public List<PetDto> getPetsByUserId(@PathVariable Long userId) {
        return petService.getPetsByUserId(userId).stream().map(PetMapper::toPetDto).toList();
    }

    // ===== Create / Adopt =====

    /**
     * POST /api/pets
     *
     * <p>Creates a pet from a DTO; requires a valid {@code userId} inside the DTO. Returns 201
     * Created with the saved pet DTO.
     *
     * @param petDto pet data including owner user id
     * @return saved pet DTO
     * @throws ResponseStatusException with 404 if the owner user is not found
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

        // Map DTO -> entity, attach owner, persist, map back -> DTO
        Pet toSave = PetMapper.toEntity(petDto, owner);
        Pet saved = petService.savePet(toSave);
        return PetMapper.toPetDto(saved);
    }

    /**
     * POST /api/pets/adopt
     *
     * <p>Convenience endpoint to adopt a new pet by name/type for a given user. Returns 201 Created
     * with the new pet DTO.
     *
     * @param request adopt-pet request (userId, name, type)
     * @return newly adopted pet DTO
     * @throws ResponseStatusException with 404 if the owner user is not found
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
     * POST /api/pets/{id}/feed
     *
     * <p>Feeds the pet and returns the updated DTO.
     *
     * @param id pet id
     * @return updated pet DTO
     */
    @PostMapping("/{id}/feed")
    public PetDto feed(@PathVariable Long id) {
        Pet pet = petService.feedPet(id);
        return PetMapper.toPetDto(pet);
    }

    /**
     * POST /api/pets/{id}/play
     *
     * <p>Plays with the pet and returns the updated DTO.
     *
     * @param id pet id
     * @return updated pet DTO
     */
    @PostMapping("/{id}/play")
    public PetDto play(@PathVariable Long id) {
        Pet pet = petService.playWithPet(id);
        return PetMapper.toPetDto(pet);
    }

    /**
     * POST /api/pets/{id}/rest
     *
     * <p>Rests the pet and returns the updated DTO.
     *
     * @param id pet id
     * @return updated pet DTO
     */
    @PostMapping("/{id}/rest")
    public PetDto rest(@PathVariable Long id) {
        Pet pet = petService.restPet(id);
        return PetMapper.toPetDto(pet);
    }

    // ===== Delete =====

    /**
     * DELETE /api/pets/{id}
     *
     * <p>Deletes a pet. Returns 204 No Content.
     *
     * @param id pet id
     */
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletePet(@PathVariable Long id) {
        petService.deletePet(id);
    }
}
