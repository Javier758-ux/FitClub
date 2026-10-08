package com.fitclub.historialmembresia.infrastructure.adapter.in.web.mapper;

import com.fitclub.historialmembresia.domain.model.HistorialMembresia;
import com.fitclub.historialmembresia.infrastructure.adapter.in.web.dto.HistorialMembresiaRequestDTO;
import com.fitclub.historialmembresia.infrastructure.adapter.in.web.dto.HistorialMembresiaResponseDTO;

public final class HistorialMembresiaWebMapper {

    private HistorialMembresiaWebMapper() {}

    public static HistorialMembresia toDomain(
            HistorialMembresiaRequestDTO dto) {

        return new HistorialMembresia(
                null,
                dto.getMembresiaId(),
                dto.getEstadoAnterior(),
                dto.getEstadoNuevo(),
                null,
                dto.getMotivo(),
                "SISTEMA"
        );
    }

    public static HistorialMembresiaResponseDTO toResponseDTO(
            HistorialMembresia historial) {

        return new HistorialMembresiaResponseDTO(
                historial.getId(),
                historial.getMembresiaId(),
                historial.getEstadoAnterior(),
                historial.getEstadoNuevo(),
                historial.getFechaCambio(),
                historial.getMotivo(),
                historial.getUsuarioEmail()
        );
    }
}