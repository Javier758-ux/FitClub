package com.fitclub.clase.infrastructure.adapter.in.web.mapper;

import com.fitclub.clase.domain.model.Clase;
import com.fitclub.clase.infrastructure.adapter.in.web.dto.ClaseRequestDTO;
import com.fitclub.clase.infrastructure.adapter.in.web.dto.ClaseResponseDTO;

public final class ClaseWebMapper {

    private ClaseWebMapper() {}

    public static Clase toDomain(ClaseRequestDTO dto) {
        return new Clase(
                null,
                dto.getNombre(),
                dto.getDescripcion(),
                dto.getCupoMaximo()
        );
    }

    public static ClaseResponseDTO toResponseDTO(Clase clase) {
        return new ClaseResponseDTO(
                clase.getId(),
                clase.getNombre(),
                clase.getDescripcion(),
                clase.getCupoMaximo()
        );
    }
}
