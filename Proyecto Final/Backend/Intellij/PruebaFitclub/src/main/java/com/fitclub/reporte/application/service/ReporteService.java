package com.fitclub.reporte.application.service;

import com.fitclub.clase.application.port.in.ClaseUseCase;
import com.fitclub.clase.domain.exception.ClaseNoEncontradaException;
import com.fitclub.horario.application.port.in.HorarioUseCase;
import com.fitclub.horario.domain.exception.HorarioClaseNoEncontradoException;
import com.fitclub.reporte.application.port.in.ReporteUseCase;
import com.fitclub.reporte.domain.model.ReporteOcupacion;
import com.fitclub.reserva.application.port.in.ReservaClaseUseCase;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ReporteService implements ReporteUseCase {
    private final HorarioUseCase horarioUseCase;
    private final ClaseUseCase claseUseCase;
    private final ReservaClaseUseCase reservaUseCase;

    @Override
    @Transactional(readOnly = true)
    public ReporteOcupacion obtenerOcupacionPorHorario(Long horarioId) {
        var horario = horarioUseCase.buscarPorId(horarioId)
                .orElseThrow(() -> new HorarioClaseNoEncontradoException(horarioId));

        var clase = claseUseCase.buscarPorId(horario.getClaseId())
                .orElseThrow(() -> new ClaseNoEncontradaException(horario.getClaseId()));

        int reservasActivas = reservaUseCase.listarActivasPorHorario(horarioId).size();
        int disponibles = Math.max(clase.getCupoMaximo() - reservasActivas, 0);
        double porcentaje = clase.getCupoMaximo() == 0 ? 0 :
                (reservasActivas * 100.0) / clase.getCupoMaximo();

        return new ReporteOcupacion(
                horarioId,
                clase.getId(),
                clase.getNombre(),
                clase.getCupoMaximo(),
                reservasActivas,
                disponibles,
                porcentaje
        );
    }
}