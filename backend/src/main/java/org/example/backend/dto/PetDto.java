package org.example.backend.dto;

import org.example.backend.service.PetService;

public class PetDto {
    private Long id;
    private String name;
    private String type;
    private int level;
    private int hunger;
    private int happiness;
    private int energy;
    private Long userId;

    public int getEnergy() {
        return energy;
    }
    public void setEnergy(int energy) {
        this.energy = energy;
    }
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    public String getType() {
        return type;
    }
    public void setType(String type) {
        this.type = type;
    }
    public int getLevel() {
        return level;
    }
    public void setLevel(int level) {
        this.level = level;
    }
    public int getHunger() {
        return hunger;
    }
    public void setHunger(int hunger) {
        this.hunger = hunger;
    }
    public int getHappiness() {
        return happiness;
    }
    public void setHappiness(int happiness) {
        this.happiness = happiness;
    }
    public Long getUserId() {
        return userId;
    }
    public void setUserId(Long userId) {
        this.userId = userId;
    }

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
