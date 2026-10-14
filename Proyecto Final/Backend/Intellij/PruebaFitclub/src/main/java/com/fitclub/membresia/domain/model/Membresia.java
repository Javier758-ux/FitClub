package com.fitclub.membresia.domain.model;

import lombok.*;

import java.time.LocalDate;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Membresia {
    private Long id;
    private Long socioId;
    private Long planId;
    private LocalDate fechaInicio;
    private LocalDate fechaFin;
    private EstadoMembresia estado;
}