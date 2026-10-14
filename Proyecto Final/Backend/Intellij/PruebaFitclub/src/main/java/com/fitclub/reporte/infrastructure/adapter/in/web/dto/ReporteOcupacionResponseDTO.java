package com.fitclub.reporte.infrastructure.adapter.in.web.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter @AllArgsConstructor
public class ReporteOcupacionResponseDTO {
    private Long horarioId;
    private Long claseId;
    private String clase;
    private Integer cupoMaximo;
    private Integer reservasActivas;
    private Integer cuposDisponibles;
    private Double porcentajeOcupacion;
}