package org.example.backend.controller;

import jakarta.validation.Valid;
import org.example.backend.dto.LoginRequest;
import org.example.backend.dto.RegisterRequest;
import org.example.backend.model.User;
import org.example.backend.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

/**
 * REST controller handling user authentication operations such as login and registration.
 *
 * <p>Normalizes username and email (trim + lowercase) before lookups/creates and uses
 * {@link jakarta.validation.Valid} to trigger Bean Validation on request DTOs.
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;
    private final PasswordEncoder passwordEncoder;

    public AuthController(UserService userService, PasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
    }

    // ===== Helpers =====

    /**
     * Trims and lowercases the given username for consistent lookups.
     *
     * @param raw raw username from the request
     * @return normalized username or {@code null} if empty/blank
     */
    private String normalizeUsername(String raw) {
        if (raw == null) return null;
        String v = raw.trim().toLowerCase();
        return v.isEmpty() ? null : v;
    }

    /**
     * Trims and lowercases the given email for consistent uniqueness checks.
     *
     * @param raw raw email from the request
     * @return normalized email or {@code null} if empty/blank
     */
    private String normalizeEmail(String raw) {
        if (raw == null) return null;
        String v = raw.trim().toLowerCase();
        return v.isEmpty() ? null : v;
    }

    // ===== Login =====

    /**
     * POST /api/auth/login
     *
     * <p>Validates username and password and returns the user id if credentials are valid.
     *
     * @param request login request containing username and password
     * @return the authenticated user's id
     * @throws ResponseStatusException with 401 if username or password is invalid
     */
    @PostMapping("/login")
    public Long login(@Valid @RequestBody LoginRequest request) {
        String username = normalizeUsername(request.getUsername());

        User user = userService.findByUsername(username);
        if (user == null || !passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid username or password");
        }
        return user.getId();
    }

    // ===== Register =====

    /**
     * POST /api/auth/register
     *
     * <p>Creates a new user with normalized username and email and returns the new user id.
     *
     * @param request registration data (username, email, password)
     * @return the newly created user's id
     */
    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public Long register(@Valid @RequestBody RegisterRequest request) {
        String username = normalizeUsername(request.getUsername());
        String email = normalizeEmail(request.getEmail());

        User newUser = userService.registerNewUser(username, email, request.getPassword());
        return newUser.getId();
    }
}
