package org.example.backend.repository;

import org.example.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for {@link User} entities.
 *
 * <p>Provides basic CRUD operations plus helpers to look up users
 * by normalized username or email.
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    /**
     * Find a user by normalized username.
     *
     * @param username normalized username (trimmed + lowercased)
     * @return the matching user, or {@code null} if none found
     */
    User findByUsername(String username);

    /**
     * Find a user by normalized email.
     *
     * @param email normalized email (trimmed + lowercased)
     * @return the matching user, or {@code null} if none found
     */
    User findByEmail(String email);
}
