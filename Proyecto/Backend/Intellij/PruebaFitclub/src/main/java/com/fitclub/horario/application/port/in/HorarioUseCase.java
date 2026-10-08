package com.fitclub.horario.application.port.in;

import com.fitclub.horario.domain.model.HorarioClase;
import java.util.List;
import java.util.Optional;
import java.time.LocalDate;

public interface HorarioUseCase {
    HorarioClase registrar(HorarioClase horario);
    List<HorarioClase> listar();
    Optional<HorarioClase> buscarPorId(Long id);
    HorarioClase actualizar(Long id, HorarioClase horario);
    List<HorarioClase> listarPorInstructorYFecha(Long instructorId, LocalDate fecha);
}
