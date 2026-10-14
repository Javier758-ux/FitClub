package com.fitclub.asistencia.infrastructure.adapter.in.web.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter @AllArgsConstructor
public class AsistenciaResponseDTO {
    private Long id;
    private Long reservaClaseId;
    private LocalDateTime fechaRegistro;
    private Boolean presente;
}
