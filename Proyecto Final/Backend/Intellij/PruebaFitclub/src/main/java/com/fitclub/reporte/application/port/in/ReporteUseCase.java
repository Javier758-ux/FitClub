package com.fitclub.reporte.application.port.in;

import com.fitclub.reporte.domain.model.ReporteOcupacion;

public interface ReporteUseCase {
    ReporteOcupacion obtenerOcupacionPorHorario(Long horarioId);
}