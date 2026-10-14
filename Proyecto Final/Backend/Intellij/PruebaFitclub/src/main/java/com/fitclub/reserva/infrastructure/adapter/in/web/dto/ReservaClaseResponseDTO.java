package com.fitclub.reserva.infrastructure.adapter.in.web.dto;

import com.fitclub.reserva.domain.model.EstadoReserva;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter @AllArgsConstructor
public class ReservaClaseResponseDTO {
    private Long id;
    private Long socioId;
    private Long horarioClaseId;
    private LocalDateTime fechaReserva;
    private EstadoReserva estado;
    private LocalDateTime fechaCancelacion;
    private Boolean cancelacionTardia;
}