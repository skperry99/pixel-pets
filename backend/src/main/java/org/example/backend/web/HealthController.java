package org.example.backend.web;

import java.util.Map;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Lightweight health/heartbeat endpoint.
 *
 * <p>Useful for uptime checks, load balancer health probes, and quick
 * diagnostics from the frontend or external monitors.
 *
 * <p>Example: GET /api/health → {"status":"UP"}
 */
@RestController
@RequestMapping("/api")
public class HealthController {

    /**
     * Simple liveness check.
     *
     * @return a small JSON payload indicating the service is running
     */
    @GetMapping("/health")
    public Map<String, Object> health() {
        return Map.of("status", "UP");
    }
}
