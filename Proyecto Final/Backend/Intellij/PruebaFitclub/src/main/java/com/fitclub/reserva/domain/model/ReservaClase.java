package com.fitclub.reserva.domain.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class ReservaClase {
    private Long id;
    private Long socioId;
    private Long horarioClaseId;
    private LocalDateTime fechaReserva;
    private EstadoReserva estado;
    private LocalDateTime fechaCancelacion;
    private Boolean cancelacionTardia;
}