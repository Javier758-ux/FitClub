package com.fitclub.plan.infrastructure.adapter.in.web.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter @Setter @NoArgsConstructor
public class PlanRequestDTO {
    @NotBlank
    private String nombre;
    private String descripcion;

    @NotNull
    @Positive
    private BigDecimal precio;

    @NotNull
    @Positive
    private Integer duracionDias;
}