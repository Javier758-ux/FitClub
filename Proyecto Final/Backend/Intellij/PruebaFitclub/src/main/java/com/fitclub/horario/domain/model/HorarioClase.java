package com.fitclub.horario.domain.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class HorarioClase {
    private Long id;
    private Long claseId;
    private Long instructorId;
    private LocalDate fecha;
    private LocalTime horaInicio;
    private LocalTime horaFin;
}