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
 * Authentication endpoints for login and registration. - Normalizes usernames/emails (trim +
 * lowercase) before lookups/creates - Uses @Valid to trigger Bean Validation on request DTOs
 */
@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

  private final UserService userService;
  private final PasswordEncoder passwordEncoder;

  public AuthController(UserService userService, PasswordEncoder passwordEncoder) {
    this.userService = userService;
    this.passwordEncoder = passwordEncoder;
  }

  // ===== Helpers =====

  /** Trim and lower-case username for consistent lookups. */
  private String normalizeUsername(String raw) {
    if (raw == null) return null;
    String v = raw.trim().toLowerCase();
    return v.isEmpty() ? null : v;
  }

  /** Trim and lower-case email for consistent uniqueness checks. */
  private String normalizeEmail(String raw) {
    if (raw == null) return null;
    String v = raw.trim().toLowerCase();
    return v.isEmpty() ? null : v;
  }

  // ===== Login =====

  /*
   * POST /api/auth/login
   * Validates username/password; returns userId if OK, 401 otherwise.
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

  /*
   * POST /api/auth/register
   * Creates a new user with normalized username/email. Returns 201 + userId.
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
