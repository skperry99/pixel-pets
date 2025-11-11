package org.example.backend.mapper;

import org.example.backend.dto.UserDto;
import org.example.backend.model.User;

/**
 * Maps between User entities and UserDto API objects. - Does NOT touch sensitive fields (password
 * handled in the service layer) - Keep normalization (trim/lowercase) in UserService, not here
 */
public final class UserMapper {

    // Prevent instantiation (utility class)
    private UserMapper() {
    }

    // ===== Entity -> DTO =====

    /**
     * Convert a User entity to a UserDto for responses.
     */
    public static UserDto toUserDto(User user) {
        if (user == null) return null;

        return new UserDto(user.getId(), user.getUsername(), user.getEmail());
    }

    // ===== DTO -> Entity (create) =====

    /**
     * Build a new User entity from a UserDto. Note: password is intentionally NOT mapped here;
     * handled by the service.
     */
    public static User toEntity(UserDto dto) {
        if (dto == null) return null;

        User user = new User();

        // Only set ID if present (useful for PUT/update flows)
        if (dto.getId() != null) {
            user.setId(dto.getId());
        }

        user.setUsername(dto.getUsername());
        user.setEmail(dto.getEmail());
        return user;
    }
}
