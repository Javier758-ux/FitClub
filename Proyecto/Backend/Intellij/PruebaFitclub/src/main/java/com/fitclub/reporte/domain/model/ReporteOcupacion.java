package com.fitclub.reporte.domain.model;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter @AllArgsConstructor
public class ReporteOcupacion {
    private Long horarioId;
    private Long claseId;
    private String clase;
    private Integer cupoMaximo;
    private Integer reservasActivas;
    private Integer cuposDisponibles;
    private Double porcentajeOcupacion;
}