package org.example.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Global CORS configuration for the Pixel Pets backend.
 *
 * <p>Allows the React frontend (local dev + Netlify) to call the API from a different origin.
 */
@Configuration
public class CorsConfig {

    /**
     * Configure CORS for all endpoints.
     *
     * <p>Currently allows:
     * <ul>
     *   <li>Local Vite dev server: {@code http://localhost:5173}</li>
     *   <li>Production Netlify site: {@code https://pixelpets.netlify.app}</li>
     *   <li>Netlify previews: {@code https://*.netlify.app}</li>
     * </ul>
     *
     * <p>We do not use cookies/sessions, so {@code allowCredentials(false)} keeps things simple.
     */
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry
                        .addMapping("/**")
                        // Exact origin for local dev + Netlify (including deploy previews)
                        .allowedOriginPatterns(
                                "http://localhost:5173",
                                "https://pixelpets.netlify.app",
                                "https://*.netlify.app")
                        .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
                        .allowedHeaders("*")   // allow Content-Type, Authorization, etc.
                        .exposedHeaders("*")
                        .allowCredentials(false) // no cookies/sessions
                        .maxAge(3600);
            }
        };
    }
}
