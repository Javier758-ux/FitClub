package com.fitclub.notificacion.infrastructure.adapter.out.persistence.mapper;

import com.fitclub.notificacion.domain.model.Notificacion;
import com.fitclub.notificacion.infrastructure.adapter.out.persistence.entity.NotificacionJpaEntity;
import com.fitclub.socio.infrastructure.adapter.out.persistence.entity.SocioJpaEntity;

public final class NotificacionPersistenceMapper {
    private NotificacionPersistenceMapper() {}
    public static NotificacionJpaEntity toEntity(
            Notificacion notificacion,
            SocioJpaEntity socio) {

        return new NotificacionJpaEntity(
                notificacion.getId(),
                socio,
                notificacion.getTitulo(),
                notificacion.getMensaje(),
                notificacion.getFechaEnvio(),
                notificacion.getLeida()
        );
    }

    public static Notificacion toDomain(
            NotificacionJpaEntity entity) {

        return new Notificacion(
                entity.getId(),
                entity.getSocio().getId(),
                entity.getTitulo(),
                entity.getMensaje(),
                entity.getFechaEnvio(),
                entity.getLeida()
        );
    }
}