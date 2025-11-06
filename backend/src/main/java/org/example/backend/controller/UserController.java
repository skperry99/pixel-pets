package org.example.backend.controller;

import org.example.backend.dto.UserDto;
import org.example.backend.dto.UserUpdateRequest;
import org.example.backend.mapper.UserMapper;
import org.example.backend.model.User;
import org.example.backend.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public List<UserDto> getAllUsers() {
        return userService.getAllUsers().stream().map(UserMapper::toUserDto).collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public UserDto getUserById(@PathVariable Long id) {
        User user = userService.getUserById(id);
        return (user != null) ? UserMapper.toUserDto(user) : null;
    }

    @PostMapping
    public UserDto createUser(@RequestBody UserDto userDto) {
        // Convert DTO to entity
        User user = UserMapper.toEntity(userDto);
        // Save entity
        User savedUser = userService.saveUser(user);
        // Convert back to DTO and return
        return UserMapper.toUserDto(savedUser);
    }

    @PutMapping("/{id}")
    public UserDto updateUser(@PathVariable Long id, @RequestBody UserUpdateRequest req) {

        User updatedUser = userService.updateUser(id, req.getUsername(), req.getEmail(), req.getPassword());
        return new UserDto(updatedUser.getId(), updatedUser.getUsername(), updatedUser.getEmail());
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
    }
}
