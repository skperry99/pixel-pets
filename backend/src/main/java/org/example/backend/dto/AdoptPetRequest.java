package org.example.backend.dto;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class AdoptPetRequest {
    private String name;
    private String type;
    private Long userId;

}
