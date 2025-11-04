package org.example.backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Entity
public class Pet {
    // Getters and Setters
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String name;
    private String type;
    private int level;
    private int hunger;
    private int happiness;
    private int energy;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    public Pet() {}

    public Pet(String name, String type) {
        this.name = name;
        this.type = type;
        this.level = 1;
        this.hunger = 100;
        this.happiness = 100;
        this.energy = 100;
    }
}
