package com.fitclub.horario.infrastructure.adapter.in.web.mapper;

import com.fitclub.horario.domain.model.HorarioClase;
import com.fitclub.horario.infrastructure.adapter.in.web.dto.HorarioClaseRequestDTO;
import com.fitclub.horario.infrastructure.adapter.in.web.dto.HorarioClaseResponseDTO;

public final class HorarioClaseWebMapper {
    private HorarioClaseWebMapper() {}
    public static HorarioClase toDomain(
            HorarioClaseRequestDTO dto) {

        return new HorarioClase(
                null,
                dto.getClaseId(),
                dto.getInstructorId(),
                dto.getFecha(),
                dto.getHoraInicio(),
                dto.getHoraFin()
        );
    }

    public static HorarioClaseResponseDTO toResponseDTO(
            HorarioClase horario) {

        return new HorarioClaseResponseDTO(
                horario.getId(),
                horario.getClaseId(),
                horario.getInstructorId(),
                horario.getFecha(),
                horario.getHoraInicio(),
                horario.getHoraFin()
        );
    }
}