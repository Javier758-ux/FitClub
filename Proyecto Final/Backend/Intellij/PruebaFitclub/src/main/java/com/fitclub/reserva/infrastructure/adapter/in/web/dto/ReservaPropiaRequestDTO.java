package com.fitclub.reserva.infrastructure.adapter.in.web.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record ReservaPropiaRequestDTO(
        @NotNull @Positive Long horarioClaseId
) {}