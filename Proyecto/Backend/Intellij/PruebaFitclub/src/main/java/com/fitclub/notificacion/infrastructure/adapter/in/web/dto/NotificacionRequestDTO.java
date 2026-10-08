package com.fitclub.notificacion.infrastructure.adapter.in.web.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter @NoArgsConstructor
public class NotificacionRequestDTO {
    @NotNull
    @Positive
    private Long socioId;

    @NotBlank
    private String titulo;

    @NotBlank
    private String mensaje;
}