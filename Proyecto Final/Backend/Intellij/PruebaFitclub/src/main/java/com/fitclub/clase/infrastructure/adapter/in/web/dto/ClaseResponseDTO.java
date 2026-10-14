package com.fitclub.clase.infrastructure.adapter.in.web.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter @AllArgsConstructor
public class ClaseResponseDTO {

    private Long id;
    private String nombre;
    private String descripcion;
    private Integer cupoMaximo;
}
