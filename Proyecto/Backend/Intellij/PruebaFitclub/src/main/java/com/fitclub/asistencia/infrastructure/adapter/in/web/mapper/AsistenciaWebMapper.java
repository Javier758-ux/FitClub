package com.fitclub.asistencia.infrastructure.adapter.in.web.mapper;

import com.fitclub.asistencia.domain.model.Asistencia;
import com.fitclub.asistencia.infrastructure.adapter.in.web.dto.AsistenciaRequestDTO;
import com.fitclub.asistencia.infrastructure.adapter.in.web.dto.AsistenciaResponseDTO;

public final class AsistenciaWebMapper {
    private AsistenciaWebMapper() {}
    public static Asistencia toDomain(AsistenciaRequestDTO dto) {
        return new Asistencia(
                null,
                dto.getReservaClaseId(),
                null,
                dto.getPresente()
        );
    }

    public static AsistenciaResponseDTO toResponseDTO(Asistencia asistencia) {
        return new AsistenciaResponseDTO(
                asistencia.getId(),
                asistencia.getReservaClaseId(),
                asistencia.getFechaRegistro(),
                asistencia.getPresente()
        );
    }
}
