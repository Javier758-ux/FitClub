package com.fitclub.plan.domain.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Plan {

    private Long id;
    private String nombre;
    private String descripcion;
    private BigDecimal precio;
    private Integer duracionDias;
}