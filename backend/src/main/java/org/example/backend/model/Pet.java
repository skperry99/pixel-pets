package org.example.backend.model;

import jakarta.persistence.*;

import java.time.Instant;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Entity
@Table(name = "pets")
public class Pet {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String name;
    private String type;
    private int level;
    @Column(name = "fullness")
    private int fullness;
    private int happiness;
    private int energy;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(nullable = false)
    private Instant lastTickAt;

    @PrePersist
    public void onCreate() {
        if (lastTickAt == null) {
            lastTickAt = Instant.now();
        }
    }

    public Pet() {
    }

    public Pet(String name, String type) {
        this.name = name;
        this.type = type;
        this.level = 1;
        this.fullness = 100;
        this.happiness = 100;
        this.energy = 100;
    }
}
