package org.example.backend.mapper;

import org.example.backend.dto.UserDto;
import org.example.backend.model.User;

/**
 * Maps between User entities and UserDto API objects.
 *
 * <p>Responsibilities:
 * <ul>
 *   <li>Convert JPA entities to API-safe DTOs.</li>
 *   <li>Build User entities from DTOs for create/update flows.</li>
 *   <li>Avoid handling sensitive fields (e.g., password); those are
 *       managed in the service layer.</li>
 * </ul>
 *
 * <p>Normalization (trim/lowercase) is intentionally kept in {@link org.example.backend.service.UserService}
 * so it is consistent across all entry points.
 */
public final class UserMapper {

    // Prevent instantiation (utility class)
    private UserMapper() {}

    // ===== Entity -> DTO =====

    /** Convert a User entity to a UserDto for API responses. */
    public static UserDto toUserDto(User user) {
        if (user == null) return null;

        return new UserDto(user.getId(), user.getUsername(), user.getEmail());
    }

    // ===== DTO -> Entity (create/update) =====

    /**
     * Build a User entity from a UserDto.
     *
     * <p>Notes:
     * <ul>
     *   <li>Only non-sensitive fields (id, username, email) are mapped.</li>
     *   <li>Password is intentionally not set here; it is handled (and hashed)
     *       in the service layer.</li>
     *   <li>If an id is present, it is copied to support update flows.</li>
     * </ul>
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
