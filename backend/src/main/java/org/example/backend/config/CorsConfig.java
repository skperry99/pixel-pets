package org.example.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig {

  @Bean
  public WebMvcConfigurer corsConfigurer() {
    return new WebMvcConfigurer() {
      @Override
      public void addCorsMappings(CorsRegistry registry) {
        registry
            .addMapping("/**")
            // exact origin for local dev + allow Netlify (including deploy previews)
            .allowedOriginPatterns(
                "http://localhost:5173", "https://pixelpets.netlify.app", "https://*.netlify.app")
            .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
            .allowedHeaders("*") // <-- allow Content-Type etc.
            .exposedHeaders("*")
            .allowCredentials(false) // no cookies/sessions; makes life simpler
            .maxAge(3600);
      }
    };
  }
}
