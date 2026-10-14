package com.fitclub.notificacion.infrastructure.adapter.in.web.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter @AllArgsConstructor
public class NotificacionResponseDTO {
    private Long id;
    private Long socioId;
    private String titulo;
    private String mensaje;
    private LocalDateTime fechaEnvio;
    private Boolean leida;
}