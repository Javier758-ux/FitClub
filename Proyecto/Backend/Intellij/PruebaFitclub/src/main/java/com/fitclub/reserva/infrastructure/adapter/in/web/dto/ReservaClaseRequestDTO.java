package com.fitclub.reserva.infrastructure.adapter.in.web.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter @NoArgsConstructor
public class ReservaClaseRequestDTO {
    @NotNull
    @Positive
    private Long socioId;

    @NotNull
    @Positive
    private Long horarioClaseId;
}