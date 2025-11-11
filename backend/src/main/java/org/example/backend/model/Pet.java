package org.example.backend.model;

import jakarta.persistence.*;
import java.time.Instant;
import lombok.Getter;
import lombok.Setter;

/**
 * Pet entity. - Maps DB column "hunger" to the domain field "fullness" (higher = better). - Tracks
 * lastTickAt for time-based stat decay. - Uses safe defaults on create so new pets are always
 * playable.
 */
@Getter
@Setter
@Entity
@Table(name = "pets") // ⬅ ensure this matches your actual table name
public class Pet {

  // ========= Identity =========
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  // ========= Basic info =========
  @Column(nullable = false)
  private String name;

  @Column(nullable = false)
  private String type;

  /** Pet level; defaults to 1 if unset. */
  private int level;

  // ========= Stats (0–100) =========
  /** Fullness stored in DB column "hunger" but exposed as "fullness" in code. */
  @Column(name = "hunger", nullable = false)
  private int fullness;

  @Column(nullable = false)
  private int happiness;

  @Column(nullable = false)
  private int energy;

  /** Timestamp of last server-side “tick” for time decay. */
  @Column(name = "last_tick_at", nullable = false)
  private Instant lastTickAt;

  // ========= Relationships =========
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "user_id")
  private User user;

  // ========= Constructors =========
  public Pet() {
    /* for JPA */
  }

  public Pet(String name, String type) {
    this.name = name;
    this.type = type;
    this.level = 1;
    this.fullness = 80;
    this.happiness = 80;
    this.energy = 80;
    // lastTickAt set in @PrePersist
  }

  // ========= Lifecycle hooks =========
  @PrePersist
  protected void onCreate() {
    // Ensure stats are initialized (covers cases when created via mapper with missing values)
    if (level <= 0) level = 1;

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
