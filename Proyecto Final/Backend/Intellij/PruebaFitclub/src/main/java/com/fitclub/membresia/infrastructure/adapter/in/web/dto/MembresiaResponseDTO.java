package com.fitclub.membresia.infrastructure.adapter.in.web.dto;

import com.fitclub.membresia.domain.model.EstadoMembresia;
import lombok.*;

import java.time.LocalDate;

@Getter @AllArgsConstructor
public class MembresiaResponseDTO {

    private Long id;
    private Long socioId;
    private Long planId;
    private LocalDate fechaInicio;
    private LocalDate fechaFin;
    private EstadoMembresia estado;
}