package org.example.backend.dto;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class PetDto {
    private Long id;
    private String name;
    private String type;
    private int level;
    private int hunger;
    private int happiness;
    private int energy;
    private Long userId;

    public PetDto() {}

    public PetDto(Long id, String name, String type, int level, int hunger, int happiness, int energy, Long userId) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.level = level;
        this.hunger = hunger;
        this.happiness = happiness;
        this.energy = energy;
        this.userId = userId;
    }
}
