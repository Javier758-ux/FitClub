package com.fitclub.membresia.infrastructure.adapter.in.web.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.*;

import java.time.LocalDate;

@Getter @Setter @NoArgsConstructor
public class MembresiaRequestDTO {

    @NotNull
    @Positive
    private Long socioId;

    @NotNull
    @Positive
    private Long planId;

    @NotNull
    private LocalDate fechaInicio;
}