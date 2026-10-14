package com.fitclub.historialmembresia.infrastructure.adapter.in.web.dto;

import com.fitclub.membresia.domain.model.EstadoMembresia;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class HistorialMembresiaRequestDTO {

    @NotNull
    @Positive
    private Long membresiaId;

    private EstadoMembresia estadoAnterior;

    @NotNull
    private EstadoMembresia estadoNuevo;

    private String motivo;
}