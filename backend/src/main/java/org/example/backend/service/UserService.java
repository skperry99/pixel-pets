package org.example.backend.service;

import org.example.backend.model.User;
import org.example.backend.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User saveUser(User user) {
        // Hash the password before saving
        String hashedPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(hashedPassword);
        return userRepository.save(user);
    }

    public User getUserById(Long id) {
        return userRepository.findById(id).orElse(null);
    }

    public User findByUsername(String username) { return userRepository.findByUsername(username); }
    public User findByEmail(String email) { return userRepository.findByEmail(email); }

    public User registerNewUser(String username, String email, String rawPassword) {
        // check for existing username or email
        if (findByUsername(username) != null) throw new RuntimeException("Username already exits");
        if (findByEmail(email) != null) throw new RuntimeException("Email already exists");

        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        // hash password in saveUser method
        user.setPassword(rawPassword);
        return saveUser(user);
    }

    public User updateUser(Long id, String newUsername, String newEmail, String newRawPassword) {
        User user = userRepository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found" + id));

        // username update
        if (newUsername != null && !newUsername.isEmpty() && !newUsername.equals(user.getUsername())) {
            User existingUser = userRepository.findByUsername(newUsername);
            if (existingUser != null && !existingUser.getId().equals(id)) {
                throw new RuntimeException("Username already exists");
            }
            user.setUsername(newUsername);
        }

        // email update
        if (newEmail != null && !newEmail.isEmpty() && !newEmail.equals(user.getEmail())) {
            User existingUser = userRepository.findByEmail(newEmail);
            if (existingUser != null && !existingUser.getId().equals(id)) {
                throw new RuntimeException("Email already exists");
            }
            user.setEmail(newEmail);
        }

        // password update
        if (newRawPassword != null && !newRawPassword.isEmpty()) {
            String hashedPassword = passwordEncoder.encode(newRawPassword);
            user.setPassword(hashedPassword);
        }

        return userRepository.save(user);
    }

    public void deleteUserById(Long id) {
        userRepository.deleteById(id);
    }
}
