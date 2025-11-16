package org.example.backend.model;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;
import lombok.Getter;
import lombok.Setter;

/**
 * User entity.
 *
 * <p>Responsibilities:
 * <ul>
 *   <li>Maps to a dedicated {@code users} table (avoids reserved keyword conflicts).</li>
 *   <li>Enforces unique username/email at the DB level.</li>
 *   <li>Owns a 1:N relationship to {@link Pet} (with cascade + orphan removal).</li>
 * </ul>
 *
 * <p>Note: normalization (trim + lowercase) is handled in the service layer, not here.
 */
@Getter
@Setter
@Entity
@Table(name = "users") // keep in sync with your actual table name
public class User {

    // ===== Identity =====
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ===== Credentials / Profile =====

    /**
     * Normalized username (service layer should trim + lowercase).
     * Stored as {@code user_name} to avoid clashes and improve readability.
     */
    @Column(name = "user_name", nullable = false, unique = true)
    private String username;

    /** Normalized email (service layer should trim + lowercase). */
    @Column(nullable = false, unique = true)
    private String email;

    /** BCrypt (or similar) hash; never return this in API responses. */
    @Column(nullable = false)
    private String password;

    // ===== Relationships =====

    /**
     * A user can own many pets.
     *
     * <p>{@code cascade = ALL} lets us create/update pets via the user.
     * {@code orphanRemoval = true} ensures removing from the list deletes the pet row.
     */
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Pet> pets = new ArrayList<>();

    // ===== Constructors =====

    /** No-arg constructor required by JPA. */
    public User() {
        /* for JPA */
    }

    /** Convenience constructor for quick creation in tests/seed data. */
    public User(String username, String email, String password) {
        this.username = username;
        this.email = email;
        this.password = password;
    }

    // ===== Notes =====
    // - Do NOT include password in toString()/equals()/hashCode().
    // - Prefer DTOs for API payloads; never expose raw entities with password.
    // - Ensure unique indexes exist on (user_name) and (email) at the DB level.
}
