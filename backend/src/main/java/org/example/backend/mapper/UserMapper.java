package org.example.backend.mapper;

import org.example.backend.dto.UserDto;
import org.example.backend.model.User;

public class UserMapper {

    // Convert Entity -> DTO (for sending data to frontend)
    public static UserDto toUserDto(User user) {
        if (user == null) {
            return null;
        }

        return new UserDto(
                user.getId(),
                user.getUsername(),   // maps entity field -> dto field
                user.getEmail()
        );
    }

    // Convert DTO -> Entity (for receiving data from frontend)
    public static User toEntity(UserDto userDto) {
        if (userDto == null) {
            return null;
        }

        User user = new User();

        // Only set ID if present (useful for PUT/update operations)
        if (userDto.getId() != null) {
            user.setId(userDto.getId());
        }

        user.setUsername(userDto.getUsername());
        user.setEmail(userDto.getEmail());

        // Password is intentionally not set here for security reasons.
        // It should be handled in the service layer.

        return user;
    }
}