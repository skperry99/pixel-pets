package org.example.backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class RootController {
    @GetMapping("/")
    public Map<String, String> root() {
        return Map.of(
                "status", "ok",
                "app", "Pixel Pets Backend",
                "message", "Backend is running in prod 🎉"
        );
    }
}