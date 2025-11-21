package org.example.backend.dto;

import lombok.Getter;
import lombok.Setter;

/**
 * Payload for updating a user's profile.
 *
 * <p>All fields are optional:
 * <ul>
 *   <li>If a field is {@code null} or blank, the service layer will leave it unchanged.</li>
 *   <li>Non-null values are normalized and validated in {@link org.example.backend.service.UserService}.</li>
 * </ul>
 *
 * <p>This is intentionally separate from {@link UserDto} so that updates don't require
 * sending the full user object.
 */
@Getter
@Setter
public class UserUpdateRequest {

    /** New username, or null/blank to keep the current one. */
    private String username;

    /** New email, or null/blank to keep the current one. */
    private String email;

    /** New raw password, or null/blank to keep the current one. */
    private String password;
}
