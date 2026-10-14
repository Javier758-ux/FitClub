package com.fitclub.reserva.application.port.out;

import com.fitclub.reserva.domain.model.ReservaClase;

import java.util.List;
import java.util.Optional;

public interface ReservaClaseRepositoryPort {
    ReservaClase guardar(ReservaClase reserva);
    List<ReservaClase> listar();
    Optional<ReservaClase> buscarPorId(Long id);
    List<ReservaClase> buscarPorSocioId(Long socioId);
    List<ReservaClase> buscarActivasPorHorarioClaseId(Long horarioClaseId);

    boolean existeReservaActiva(Long socioId, Long horarioClaseId);
    long contarReservasActivas(Long horarioClaseId);
}