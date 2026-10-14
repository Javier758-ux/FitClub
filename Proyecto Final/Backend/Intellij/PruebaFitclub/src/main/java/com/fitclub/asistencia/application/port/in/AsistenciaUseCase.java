package com.fitclub.asistencia.application.port.in;

import com.fitclub.asistencia.domain.model.Asistencia;

import java.util.List;
import java.util.Optional;

public interface AsistenciaUseCase {
    Asistencia registrar(Asistencia asistencia);
    Asistencia registrarPorInstructor(Asistencia asistencia, Long instructorId);
    List<Asistencia> listar();
    Optional<Asistencia> buscarPorId(Long id);
}