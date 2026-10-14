package com.fitclub.clase.infrastructure.adapter.in.web.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter @NoArgsConstructor
public class ClaseRequestDTO {

    @NotBlank
    private String nombre;
    private String descripcion;

    @NotNull
    @Positive
    private Integer cupoMaximo;
}
