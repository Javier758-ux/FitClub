package com.fitclub.notificacion.infrastructure.adapter.in.web.mapper;

import com.fitclub.notificacion.domain.model.Notificacion;
import com.fitclub.notificacion.infrastructure.adapter.in.web.dto.NotificacionRequestDTO;
import com.fitclub.notificacion.infrastructure.adapter.in.web.dto.NotificacionResponseDTO;

public final class NotificacionWebMapper {
    private NotificacionWebMapper() {}
    public static Notificacion toDomain(
            NotificacionRequestDTO dto) {

        return new Notificacion(
                null,
                dto.getSocioId(),
                dto.getTitulo(),
                dto.getMensaje(),
                null,
                null
        );
    }

    public static NotificacionResponseDTO toResponseDTO(
            Notificacion notificacion) {

        return new NotificacionResponseDTO(
                notificacion.getId(),
                notificacion.getSocioId(),
                notificacion.getTitulo(),
                notificacion.getMensaje(),
                notificacion.getFechaEnvio(),
                notificacion.getLeida()
        );
    }
}