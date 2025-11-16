package org.example.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

/**
 * Request body for logging in via {@code POST /api/auth/login}.
 *
 * <p>Validation:
 * <ul>
 *   <li>{@code username}: required, 3–30 characters</li>
 *   <li>{@code password}: required, 8–30 characters</li>
 * </ul>
 */
@Setter
@Getter
public class LoginRequest {

    /** Username used to authenticate the user. */
    @NotBlank(message = "Username is required")
    @Size(min = 3, max = 30, message = "Username must be 3–30 characters")
    private String username;

    /** Plain-text password submitted for authentication. */
    @NotBlank(message = "Password is required")
    @Size(min = 8, max = 30, message = "Password must be 8–30 characters")
    private String password;
}
