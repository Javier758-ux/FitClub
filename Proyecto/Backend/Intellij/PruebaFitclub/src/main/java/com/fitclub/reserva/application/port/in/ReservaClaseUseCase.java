package com.fitclub.reserva.application.port.in;

import com.fitclub.reserva.domain.model.ReservaClase;

import java.util.List;
import java.util.Optional;

public interface ReservaClaseUseCase {
    ReservaClase registrar(ReservaClase reserva);
    ReservaClase cancelar(Long id);
    List<ReservaClase> listar();
    Optional<ReservaClase> buscarPorId(Long id);
    List<ReservaClase> listarPorSocio(Long socioId);
    List<ReservaClase> listarActivasPorHorario(Long horarioClaseId);
    ReservaClase cancelarPorSocio(Long id, Long socioId);
    List<ReservaClase> listarActivasPorHorarioDeInstructor(
            Long horarioClaseId,
            Long instructorId
    );
}