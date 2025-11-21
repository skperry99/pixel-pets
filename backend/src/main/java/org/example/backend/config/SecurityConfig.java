package org.example.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

/**
 * Basic Spring Security configuration for the Pixel Pets backend.
 *
 * <p>Notes:
 * <ul>
 *   <li>All endpoints are currently open (no authentication required).</li>
 *   <li>We still provide a {@link PasswordEncoder} bean so passwords are stored securely.</li>
 *   <li>CORS is delegated to {@link CorsConfig}.</li>
 * </ul>
 */
@Configuration
public class SecurityConfig {

    /**
     * Password encoder used by the {@link org.example.backend.service.UserService}.
     *
     * <p>BCrypt is a good default for hashing user passwords.
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * Configure HTTP security for the application.
     *
     * <p>Currently:
     * <ul>
     *   <li>Uses global CORS configuration.</li>
     *   <li>Disables CSRF (stateless / no browser forms issuing cookies).</li>
     *   <li>Leaves all endpoints publicly accessible (no auth).</li>
     *   <li>Disables form login and HTTP Basic auth.</li>
     * </ul>
     */
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                // Use the global CORS settings from CorsConfig (must come before csrf)
                .cors(Customizer.withDefaults())
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth ->
                        auth
                                // login/register are open; everything else is also open for now
                                .requestMatchers("/api/auth/**").permitAll()
                                .anyRequest().permitAll()
                )
                // No login pages or browser auth prompts
                .formLogin(form -> form.disable())
                .httpBasic(basic -> basic.disable());

        return http.build();
    }
}
