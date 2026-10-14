package com.fitclub.reporte.infrastructure.adapter.in.web;

import com.fitclub.reporte.application.port.in.ReporteUseCase;
import com.fitclub.reporte.infrastructure.adapter.in.web.dto.ReporteOcupacionResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reportes")
@RequiredArgsConstructor
public class ReporteController {
    private final ReporteUseCase useCase;

    @GetMapping("/ocupacion/horario/{horarioId}")
    public ReporteOcupacionResponseDTO obtenerOcupacion(@PathVariable Long horarioId) {
        var reporte = useCase.obtenerOcupacionPorHorario(horarioId);

        return new ReporteOcupacionResponseDTO(
                reporte.getHorarioId(),
                reporte.getClaseId(),
                reporte.getClase(),
                reporte.getCupoMaximo(),
                reporte.getReservasActivas(),
                reporte.getCuposDisponibles(),
                reporte.getPorcentajeOcupacion()
        );
    }
}