package org.example.backend.controller;

import java.util.Map;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Simple root endpoint for the Pixel Pets backend.
 *
 * <p>Useful for quick production checks and platform health monitoring.
 * Example: GET / → {"status":"ok", "app":"Pixel Pets Backend", ...}
 */
@RestController
public class RootController {

    /**
     * Root endpoint for the backend.
     *
     * @return a small JSON payload indicating the app is running
     */
    @GetMapping("/")
    public Map<String, String> root() {
        return Map.of(
                "status", "ok",
                "app", "Pixel Pets Backend",
                "message", "Backend is running 🎉"
        );
    }
}
