package com.fitclub.horario.application.port.out;

import com.fitclub.horario.domain.model.HorarioClase;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

public interface HorarioClaseRepositoryPort {
    HorarioClase guardar(HorarioClase horario);
    List<HorarioClase> listar();
    Optional<HorarioClase> buscarPorId(Long id);
    List<HorarioClase> buscarPorInstructorYFecha(Long instructorId, LocalDate fecha);

    boolean existeSolapamiento(
            Long instructorId,
            LocalDate fecha,
            LocalTime horaInicio,
            LocalTime horaFin
    );
    boolean existeSolapamientoExcluyendoId(Long id, Long instructorId, LocalDate fecha, LocalTime horaInicio, LocalTime horaFin);
}