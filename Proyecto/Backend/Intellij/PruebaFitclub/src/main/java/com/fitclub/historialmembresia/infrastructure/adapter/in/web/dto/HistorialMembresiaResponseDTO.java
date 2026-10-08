package com.fitclub.historialmembresia.infrastructure.adapter.in.web.dto;

import com.fitclub.membresia.domain.model.EstadoMembresia;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class HistorialMembresiaResponseDTO {
    private Long id;
    private Long membresiaId;
    private EstadoMembresia estadoAnterior;
    private EstadoMembresia estadoNuevo;
    private LocalDateTime fechaCambio;
    private String motivo;
    private String usuarioEmail;
}