package org.example.backend.dto;

import jakarta.validation.constraints.*;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class AdoptPetRequest {
    @NotBlank
    @Size(min = 2, max = 50)
    private String name;
    @NotBlank
    private String type;
    private Long userId;
}
