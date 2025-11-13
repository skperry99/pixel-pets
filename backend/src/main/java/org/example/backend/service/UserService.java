package org.example.backend.service;

import java.util.List;

import org.example.backend.model.User;
import org.example.backend.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

/**
 * User domain logic (CRUD + registration). - Normalizes usernames/emails (trim + lowercase) for
 * consistent storage and lookup - Uses HTTP-friendly exceptions for not-found and conflicts
 */
@Service
public class UserService {

    // ----- Dependencies -----
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    // Constructor injection keeps this testable
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // ===== Helpers (normalization) =====

    /**
     * Trim and lower-case username for consistent storage and lookup.
     */
    private String normalizeUsername(String raw) {
        if (raw == null) return null;
        String v = raw.trim().toLowerCase();
        return v.isEmpty() ? null : v;
    }

    /**
     * Trim and lower-case email for consistent storage and lookup.
     */
    private String normalizeEmail(String raw) {
        if (raw == null) return null;
        String v = raw.trim().toLowerCase();
        return v.isEmpty() ? null : v;
    }

    // ===== Reads =====

    /**
     * Return all users (as entities).
     */
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    /**
     * Return a user by id or null if not found (controllers decide 404).
     */
    public User getUserById(Long id) {
        return userRepository.findById(id).orElse(null);
    }

    /**
     * Find user by normalized username.
     */
    public User findByUsername(String username) {
        String u = normalizeUsername(username);
        return (u == null) ? null : userRepository.findByUsername(u);
    }

    /**
     * Find user by normalized email.
     */
    public User findByEmail(String email) {
        String e = normalizeEmail(email);
        return (e == null) ? null : userRepository.findByEmail(e);
    }

    // ===== Writes =====

    /**
     * Save a user, hashing the password and normalizing username/email. Intended for creating new
     * users (register flow).
     */
    public User saveUser(User user) {
        // Normalize identifiers before unique checks / storage
        user.setUsername(normalizeUsername(user.getUsername()));
        user.setEmail(normalizeEmail(user.getEmail()));

        // Hash password before saving
        String hashedPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(hashedPassword);

        return userRepository.save(user);
    }

    /**
     * Register a new user; throws 409 on duplicate username/email. Inputs are normalized before
     * checks and storage.
     */
    public User registerNewUser(String username, String email, String rawPassword) {
        String u = normalizeUsername(username);
        String e = normalizeEmail(email);

        if (u == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Username is required");
        }
        if (e == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email is required");
        }

        // Uniqueness checks against normalized values
        if (findByUsername(u) != null) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Username already taken");
        }
        if (findByEmail(e) != null) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already registered");
        }

        // Build entity and delegate to save (which normalizes + hashes as well)
        User user = new User();
        user.setUsername(u);
        user.setEmail(e);
        user.setPassword(rawPassword); // hashed in saveUser
        return saveUser(user);
    }

    /**
     * Update username/email/password with normalization and conflict checks. Throws 404 if user
     * missing, 409 if username/email conflict.
     */
    public User updateUser(Long id, String newUsername, String newEmail, String newRawPassword) {
        User user =
                userRepository
                        .findById(id)
                        .orElseThrow(
                                () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found: " + id));

        // --- Username update (normalize + uniqueness) ---
        if (newUsername != null && !newUsername.isBlank()) {
            String nextUsername = normalizeUsername(newUsername);
            if (nextUsername != null && !nextUsername.equals(user.getUsername())) {
                User existing = userRepository.findByUsername(nextUsername);
                if (existing != null && !existing.getId().equals(id)) {
                    throw new ResponseStatusException(HttpStatus.CONFLICT, "Username already taken");
                }
                user.setUsername(nextUsername);
            }
        }

        // --- Email update (normalize + uniqueness) ---
        if (newEmail != null && !newEmail.isBlank()) {
            String nextEmail = normalizeEmail(newEmail);
            if (nextEmail != null && !nextEmail.equals(user.getEmail())) {
                User existing = userRepository.findByEmail(nextEmail);
                if (existing != null && !existing.getId().equals(id)) {
                    throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already registered");
                }
                user.setEmail(nextEmail);
            }
        }

        // --- Password update (hash) ---
        if (newRawPassword != null && !newRawPassword.isBlank()) {
            String hashed = passwordEncoder.encode(newRawPassword);
            user.setPassword(hashed);
        }

        return userRepository.save(user);
    }

    /**
     * Delete a user or 404 if missing.
     */
    public void deleteUser(Long id) {
        User user =
                userRepository
                        .findById(id)
                        .orElseThrow(
                                () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found: " + id));
        userRepository.delete(user);
    }
}
