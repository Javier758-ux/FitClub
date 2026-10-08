package com.fitclub.socio.infrastructure.adapter.in.web.mapper;

import com.fitclub.socio.domain.model.Socio;
import com.fitclub.socio.infrastructure.adapter.in.web.dto.SocioRequestDTO;
import com.fitclub.socio.infrastructure.adapter.in.web.dto.SocioResponseDTO;

public final class SocioWebMapper {
    private SocioWebMapper() {}

    public static Socio toDomain(SocioRequestDTO dto) {
        return new Socio(
                null,
                dto.getNombre(),
                dto.getEmail(),
                dto.getTelefono(),
                null
        );
    }

    public static SocioResponseDTO toResponseDTO(Socio socio) {
        return new SocioResponseDTO(
                socio.getId(),
                socio.getNombre(),
                socio.getEmail(),
                socio.getTelefono(),
                socio.getFechaRegistro()
        );
    }
}