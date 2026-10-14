package com.fitclub.reserva.infrastructure.adapter.in.web.mapper;

import com.fitclub.reserva.domain.model.ReservaClase;
import com.fitclub.reserva.infrastructure.adapter.in.web.dto.ReservaClaseRequestDTO;
import com.fitclub.reserva.infrastructure.adapter.in.web.dto.ReservaClaseResponseDTO;

public final class ReservaClaseWebMapper {
    private ReservaClaseWebMapper() {}

    public static ReservaClase toDomain(ReservaClaseRequestDTO dto) {
        return new ReservaClase(
                null,
                dto.getSocioId(),
                dto.getHorarioClaseId(),
                null,
                null,
                null,
                false
        );
    }

    public static ReservaClaseResponseDTO toResponseDTO(ReservaClase reserva) {
        return new ReservaClaseResponseDTO(
                reserva.getId(),
                reserva.getSocioId(),
                reserva.getHorarioClaseId(),
                reserva.getFechaReserva(),
                reserva.getEstado(),
                reserva.getFechaCancelacion(),
                reserva.getCancelacionTardia()
        );
    }
}