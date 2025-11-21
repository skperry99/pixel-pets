package org.example.backend.model;

import jakarta.persistence.*;
import java.time.Instant;
import lombok.Getter;
import lombok.Setter;

/**
 * Pet entity.
 *
 * <p>Responsibilities:
 * <ul>
 *   <li>Maps DB column {@code hunger} to the domain field {@code fullness} (higher = better).</li>
 *   <li>Tracks {@code lastTickAt} so the service can apply time-based stat decay.</li>
 *   <li>Uses safe defaults on creation so new pets are always playable.</li>
 * </ul>
 */
@Getter
@Setter
@Entity
@Table(name = "pets") // Ensure this matches your actual table name
public class Pet {

    // ===== Identity =====
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Overloads to help JPA/mapper code that might pass primitive or wrapper
    public void setId(Long id) {
        this.id = id;
    }

    public void setId(long id) {
        this.id = Long.valueOf(id);
    }

    // ===== Basic info =====
    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String type;

    /** Pet level; defaults to 1 if unset. */
    private int level;

    // ===== Stats (0–100) =====

    /**
     * Fullness, stored in DB column {@code hunger} but exposed as {@code fullness} in code and
     * over the API.
     */
    @Column(name = "hunger", nullable = false)
    private int fullness;

    @Column(nullable = false)
    private int happiness;

    @Column(nullable = false)
    private int energy;

    /** Timestamp of last server-side “tick” used for time-based decay. */
    @Column(name = "last_tick_at", nullable = false)
    private Instant lastTickAt;

    // ===== Relationships =====
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    // ===== Constructors =====

    /** No-arg constructor required by JPA. */
    public Pet() {
        /* for JPA */
    }

    /** Convenience constructor for quickly creating a new pet with friendly defaults. */
    public Pet(String name, String type) {
        this.name = name;
        this.type = type;
        this.level = 1;
        this.fullness = 80;
        this.happiness = 80;
        this.energy = 80;
        // lastTickAt is set in @PrePersist
    }

    // ===== Lifecycle hooks =====
    @PrePersist
    protected void onCreate() {
        // Ensure stats are initialized (covers cases when created via mapper with missing values)
        if (level <= 0) {
            level = 1;
        }

        // If all stats are zero (brand-new object), seed friendly defaults
        if (fullness == 0 && happiness == 0 && energy == 0) {
            fullness = 80;
            happiness = 80;
            energy = 80;
        }

        // Stamp last tick time if missing
        if (lastTickAt == null) {
            lastTickAt = Instant.now();
        }
    }
}
