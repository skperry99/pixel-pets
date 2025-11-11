package org.example.backend.dto;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

/**
 * User data transfer object (API shape). - Used for sending/receiving user data over the wire -
 * Keep sensitive fields (e.g., password) out of this DTO - Validation here enforces minimal input
 * guarantees on create/update
 */
@Getter
@Setter
public class UserDto {

    // ===== Identity (server-assigned) =====
    private Long id;

    // ===== Public profile / credentials (non-sensitive) =====
    @NotBlank(message = "Username is required")
    @Size(min = 3, max = 30, message = "Username must be 3–30 characters")
    private String username;

    @NotBlank(message = "Email is required")
    @Email(message = "Email must be valid")
    @Size(max = 254, message = "Email is too long")
    private String email;

    // ===== Constructors =====
    public UserDto() {
        /* for Jackson */
    }

    public UserDto(Long id, String username, String email) {
        this.id = id;
        this.username = username;
        this.email = email;
    }
}
