package com.fitclub.membresia.infrastructure.adapter.in.web.mapper;

import com.fitclub.membresia.domain.model.Membresia;
import com.fitclub.membresia.infrastructure.adapter.in.web.dto.MembresiaRequestDTO;
import com.fitclub.membresia.infrastructure.adapter.in.web.dto.MembresiaResponseDTO;

public final class MembresiaWebMapper {
    private MembresiaWebMapper() {}
    public static Membresia toDomain(
            MembresiaRequestDTO dto) {

        return new Membresia(
                null,
                dto.getSocioId(),
                dto.getPlanId(),
                dto.getFechaInicio(),
                null,
                null
        );
    }

    public static MembresiaResponseDTO toResponseDTO(
            Membresia membresia) {

        return new MembresiaResponseDTO(
                membresia.getId(),
                membresia.getSocioId(),
                membresia.getPlanId(),
                membresia.getFechaInicio(),
                membresia.getFechaFin(),
                membresia.getEstado()
        );
    }
}