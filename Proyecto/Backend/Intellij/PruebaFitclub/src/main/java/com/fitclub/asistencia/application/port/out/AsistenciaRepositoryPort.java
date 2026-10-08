package com.fitclub.asistencia.application.port.out;

import com.fitclub.asistencia.domain.model.Asistencia;

import java.util.List;
import java.util.Optional;

public interface AsistenciaRepositoryPort {
    Asistencia guardar(Asistencia asistencia);
    List<Asistencia> listar();
    Optional<Asistencia> buscarPorId(Long id);
    boolean existePorReservaClaseId(Long reservaClaseId);
}