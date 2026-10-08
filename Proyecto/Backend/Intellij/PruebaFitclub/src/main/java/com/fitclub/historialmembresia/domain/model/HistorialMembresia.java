package com.fitclub.historialmembresia.domain.model;

import com.fitclub.membresia.domain.model.EstadoMembresia;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class HistorialMembresia {
    private Long id;
    private Long membresiaId;
    private EstadoMembresia estadoAnterior;
    private EstadoMembresia estadoNuevo;
    private LocalDateTime fechaCambio;
    private String motivo;
    private String usuarioEmail;
}