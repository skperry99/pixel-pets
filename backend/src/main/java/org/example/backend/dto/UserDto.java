package org.example.backend.dto;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

/**
 * User data transfer object (API shape).
 *
 * <p>Responsibilities:
 * <ul>
 *   <li>Used for sending/receiving non-sensitive user data over the wire.</li>
 *   <li>Excludes secrets (e.g., password hashes) by design.</li>
 *   <li>Applies minimal validation for create/update operations.</li>
 * </ul>
 */
@Getter
@Setter
public class UserDto {

    // ===== Identity (server-assigned) =====
    /** Database identifier for the user (null on create). */
    private Long id;

    // ===== Public profile / credentials (non-sensitive) =====
    /** Unique username, normalized and validated by the service layer. */
    @NotBlank(message = "Username is required")
    @Size(min = 3, max = 30, message = "Username must be 3–30 characters")
    private String username;

    /** Contact email; must be valid and unique in the system. */
    @NotBlank(message = "Email is required")
    @Email(message = "Email must be valid")
    @Size(max = 254, message = "Email is too long")
    private String email;

    // ===== Constructors =====

    /** Default constructor for Jackson/deserialization. */
    public UserDto() {
        // for Jackson
    }

    public UserDto(Long id, String username, String email) {
        this.id = id;
        this.username = username;
        this.email = email;
    }
}
