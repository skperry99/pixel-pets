package org.example.backend.dto;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class RegisterRequest {
  @NotBlank(message = "Username is required")
  @Size(min = 3, max = 30, message = "Username must be 3–30 characters")
  private String username;

  @NotBlank(message = "Email is required")
  @Email(message = "Email must be valid")
  @Size(max = 254, message = "Email is too long")
  private String email;

  @NotBlank(message = "Password is required")
  @Size(min = 8, max = 30, message = "Password must be 8–30 characters")
  private String password;
}
