package org.example.backend.controller;

import java.util.List;
import org.example.backend.dto.UserDto;
import org.example.backend.dto.UserUpdateRequest;
import org.example.backend.mapper.UserMapper;
import org.example.backend.model.User;
import org.example.backend.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

/**
 * REST controller for basic user CRUD operations.
 *
 * <p>All endpoints are routed under {@code /api/users}.
 */
@RestController
@RequestMapping("/api/users")
public class UserController {

    // ===== Dependencies =====

    private final UserService userService;

    /**
     * Constructor injection keeps the controller easy to test.
     *
     * @param userService user domain service
     */
    public UserController(UserService userService) {
        this.userService = userService;
    }

    // ===== Read (collection) =====

    /**
     * GET /api/users
     *
     * <p>Returns all users as DTOs.
     *
     * @return list of all users
     */
    @GetMapping
    public List<UserDto> getAllUsers() {
        return userService.getAllUsers().stream().map(UserMapper::toUserDto).toList();
    }

    // ===== Read (single) =====

    /**
     * GET /api/users/{id}
     *
     * <p>Returns a single user by id, or 404 if not found.
     *
     * @param id user id
     * @return user DTO
     * @throws ResponseStatusException with 404 if the user is not found
     */
    @GetMapping("/{id}")
    public UserDto getUserById(@PathVariable Long id) {
        User user = userService.getUserById(id);
        if (user == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found: " + id);
        }
        return UserMapper.toUserDto(user);
    }

    // ===== Create =====

    /**
     * POST /api/users
     *
     * <p>Creates a new user from a DTO. Returns 201 Created with the saved DTO.
     *
     * @param userDto incoming user data
     * @return saved user DTO
     */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public UserDto createUser(@RequestBody UserDto userDto) {
        // Map DTO -> entity
        User toSave = UserMapper.toEntity(userDto);
        // Persist
        User saved = userService.saveUser(toSave);
        // Map back -> DTO
        return UserMapper.toUserDto(saved);
    }

    // ===== Update =====

    /**
     * PUT /api/users/{id}
     *
     * <p>Updates username/email/password. Returns the updated DTO.
     *
     * @param id user id to update
     * @param req update payload (username, email, password)
     * @return updated user DTO
     */
    @PutMapping("/{id}")
    public UserDto updateUser(@PathVariable Long id, @RequestBody UserUpdateRequest req) {
        User updated = userService.updateUser(id, req.getUsername(), req.getEmail(), req.getPassword());
        return new UserDto(updated.getId(), updated.getUsername(), updated.getEmail());
        // Alternatively, for consistency: return UserMapper.toUserDto(updated);
    }

    // ===== Delete =====

    /**
     * DELETE /api/users/{id}
     *
     * <p>Deletes a user. Returns 204 No Content.
     *
     * @param id user id
     */
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
    }
}
