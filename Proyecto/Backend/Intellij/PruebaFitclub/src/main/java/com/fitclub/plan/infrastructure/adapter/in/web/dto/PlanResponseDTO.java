package com.fitclub.plan.infrastructure.adapter.in.web.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.math.BigDecimal;

@Getter @AllArgsConstructor
public class PlanResponseDTO {
    private Long id;
    private String nombre;
    private String descripcion;
    private BigDecimal precio;
    private Integer duracionDias;
}