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
 * REST controller for basic User CRUD. Routes under /api/users; CORS allowed from the Vite dev
 * server.
 */
@RestController
@RequestMapping("/api/users")
public class UserController {

  // ----- Dependencies -----
  private final UserService userService;

  // Constructor injection keeps the class easy to test
  public UserController(UserService userService) {
    this.userService = userService;
  }

  // ----- Read (collection) -----

  /** GET /api/users Returns all users as DTOs. */
  @GetMapping
  public List<UserDto> getAllUsers() {
    return userService.getAllUsers().stream().map(UserMapper::toUserDto).toList();
  }

  // ----- Read (single) -----

  /** GET /api/users/{id} Returns a single user by id, or 404 if not found. */
  @GetMapping("/{id}")
  public UserDto getUserById(@PathVariable Long id) {
    User user = userService.getUserById(id);
    if (user == null) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found: " + id);
    }
    return UserMapper.toUserDto(user);
  }

  // ----- Create -----

  /** POST /api/users Creates a new user from a DTO. Returns 201 Created with the saved DTO. */
  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public UserDto createUser(@RequestBody UserDto userDto) {
    // Map DTO -> Entity
    User toSave = UserMapper.toEntity(userDto);
    // Persist
    User saved = userService.saveUser(toSave);
    // Map back -> DTO
    return UserMapper.toUserDto(saved);
  }

  // ----- Update -----

  /** PUT /api/users/{id} Updates username/email/password. Returns the updated DTO. */
  @PutMapping("/{id}")
  public UserDto updateUser(@PathVariable Long id, @RequestBody UserUpdateRequest req) {
    User updated = userService.updateUser(id, req.getUsername(), req.getEmail(), req.getPassword());
    return new UserDto(updated.getId(), updated.getUsername(), updated.getEmail());
  }

  // ----- Delete -----

  /** DELETE /api/users/{id} Deletes a user. Returns 204 No Content. */
  @DeleteMapping("/{id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void deleteUser(@PathVariable Long id) {
    userService.deleteUser(id);
  }
}
