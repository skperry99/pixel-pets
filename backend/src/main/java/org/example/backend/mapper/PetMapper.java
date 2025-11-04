package org.example.backend.mapper;

import org.example.backend.dto.PetDto;
import org.example.backend.model.Pet;
import org.example.backend.model.User;

public class PetMapper {

    public static PetDto toPetDto(Pet pet) {
        Long userId = pet.getUser() != null ? pet.getUser().getId() : null;

        return new PetDto(
                pet.getId(),
                pet.getName(),
                pet.getType(),
                pet.getLevel(),
                pet.getHunger(),
                pet.getHappiness(),
                pet.getEnergy(),
                userId
        );
    }

    public static Pet toEntity(PetDto petDto, User user) {
        Pet pet = new Pet();

        if (petDto.getId() != null) {
            pet.setId(petDto.getId());
        }

        pet.setName(petDto.getName());
        pet.setType(petDto.getType());
        pet.setLevel(petDto.getLevel());
        pet.setHunger(petDto.getHunger());
        pet.setHappiness(petDto.getHappiness());
        pet.setEnergy(petDto.getEnergy());
        pet.setUser(user);

        return pet;
    }
}