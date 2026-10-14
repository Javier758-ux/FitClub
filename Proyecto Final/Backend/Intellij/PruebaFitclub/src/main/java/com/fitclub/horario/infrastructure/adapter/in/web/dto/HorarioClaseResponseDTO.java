package com.fitclub.horario.infrastructure.adapter.in.web.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter @AllArgsConstructor
public class HorarioClaseResponseDTO {
    private Long id;
    private Long claseId;
    private Long instructorId;
    private LocalDate fecha;
    private LocalTime horaInicio;
    private LocalTime horaFin;
}