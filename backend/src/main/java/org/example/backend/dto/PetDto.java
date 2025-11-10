package org.example.backend.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class PetDto {
    private Long id;
    private String name;
    private String type;
    private int level;
    @JsonProperty("fullness")
    @JsonAlias("hunger")        // accept old field name on input
    private int fullness;
    private int happiness;
    private int energy;
    private Long userId;

    public PetDto() {}

    public PetDto(Long id, String name, String type, int level, int fullness, int happiness, int energy, Long userId) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.level = level;
        this.fullness = fullness;
        this.happiness = happiness;
        this.energy = energy;
        this.userId = userId;
    }
}
