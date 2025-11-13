package org.example.backend.model;

import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

import lombok.Getter;
import lombok.Setter;

/**
 * User entity. - Uses a dedicated "users" table (avoids reserved keyword conflicts) - Enforces
 * unique username/email at the DB level - Owns a 1:N relationship to Pet (with cascade + orphan
 * removal)
 */
@Getter
@Setter
@Entity
@Table(name = "users") // keep in sync with your actual table name
public class User {

    // ========= Identity =========
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ========= Credentials / Profile =========
    /**
     * Normalized username (service layer should trim+lowercase). Stored as "user_name" to avoid
     * clashes and for readability.
     */
    @Column(name = "user_name", nullable = false, unique = true)
    private String username;

    /**
     * Normalized email (service layer should trim+lowercase).
     */
    @Column(nullable = false, unique = true)
    private String email;

    /**
     * BCrypt (or similar) hash; never return this in API responses.
     */
    @Column(nullable = false)
    private String password;

    // ========= Relationships =========
    /**
     * A user can own many pets. Cascade ALL lets us create/update pets via the user.
     * orphanRemoval=true ensures removing from the list deletes the pet row.
     */
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Pet> pets = new ArrayList<>();

    // ========= Constructors =========
    public User() {
        /* for JPA */
    }

    public User(String username, String email, String password) {
        this.username = username;
        this.email = email;
        this.password = password;
    }

    // ========= Notes =========
    // - Do NOT include password in toString()/equals()/hashCode().
    // - Prefer DTOs for API payloads; never expose raw entities with password.
    // - Ensure unique indexes exist on (user_name) and (email) at the DB level.
}
