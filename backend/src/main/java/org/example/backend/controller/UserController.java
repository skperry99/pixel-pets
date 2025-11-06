package org.example.backend.controller;

import org.example.backend.dto.UserDto;
import org.example.backend.mapper.UserMapper;
import org.example.backend.model.User;
import org.example.backend.service.UserService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
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

    @PutMapping
    public UserDto updateUser(@RequestBody UserDto userDto) {
        // Convert DTO to entity
        User user = UserMapper.toEntity(userDto);
        // Update entity
        User updatedUser = userService.updateUser(user);
        // Convert back to DTO and return
        return UserMapper.toUserDto(updatedUser);
    }

    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable Long id) {
        userService.deleteUserById(id);
    }
}
