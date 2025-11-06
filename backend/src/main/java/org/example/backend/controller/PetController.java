package org.example.backend.controller;

import org.example.backend.dto.AdoptPetRequest;
import org.example.backend.dto.PetDto;
import org.example.backend.mapper.PetMapper;
import org.example.backend.model.Pet;
import org.example.backend.model.User;
import org.example.backend.service.PetService;
import org.example.backend.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/pets")
@CrossOrigin(origins = "http://localhost:5173") // Vite default dev server port
public class PetController {
    private final PetService petService;
    private final UserService userService;

    public PetController(PetService petService, UserService userService) {
        this.petService = petService;
        this.userService = userService;
    }

    @GetMapping
    public List<PetDto> getAllPets() {
        return petService.getAllPets().stream().map(PetMapper::toPetDto).collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public PetDto getPetById(@PathVariable Long id) {
        Pet pet = petService.getPetById(id);
        return (pet != null) ? PetMapper.toPetDto(pet) : null;
    }

    @GetMapping("/user/{userId}")
    public List<PetDto> getPetsByUserId(@PathVariable Long userId) {
        return petService.getPetsByUserId(userId)
                .stream()
                .map(PetMapper::toPetDto)
                .collect(Collectors.toList());
    }

    @PostMapping
    public PetDto createPet(@RequestBody PetDto petDto) {
        // Validate user exists and find the user by ID
        User user = userService.getUserById(petDto.getUserId());
        if (user == null) {
            throw new RuntimeException("User not found: " + petDto.getUserId());
        }

        // Convert DTO to entity and set the user
        Pet pet = PetMapper.toEntity(petDto, user);

        // Save entity
        Pet savedPet = petService.savePet(pet);

        // Convert back to DTO and return
        return PetMapper.toPetDto(savedPet);
    }

    @PostMapping("/adopt")
    public PetDto adoptPet(@RequestBody AdoptPetRequest request) {
        // Validate user exists
        User user = userService.getUserById(request.getUserId());
        if (user == null) {
            throw new RuntimeException("User not found: " + request.getUserId());
        }

        // Create and save the pet for the user
        Pet adoptedPet = petService.createPetForUser(request.getName(), request.getType(), user);

        // Convert to DTO and return
        return PetMapper.toPetDto(adoptedPet);
    }

    @PostMapping("/{id}/feed")
    public PetDto feed(@PathVariable Long id) {
        Pet fedPet = petService.feedPet(id);
        return PetMapper.toPetDto(fedPet);
    }

    @PostMapping("/{id}/play")
    public PetDto play(@PathVariable Long id) {
        Pet playedWithPet = petService.playWithPet(id);
        return PetMapper.toPetDto(playedWithPet);
    }

    @PostMapping("/{id}/rest")
    public PetDto rest(@PathVariable Long id) {
        Pet restedPet = petService.restPet(id);
        return PetMapper.toPetDto(restedPet);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletePet(@PathVariable Long id) {
        petService.deletePet(id);
    }
}
