package com.fitclub.asistencia.infrastructure.adapter.out.persistence.mapper;

import com.fitclub.asistencia.domain.model.Asistencia;
import com.fitclub.asistencia.infrastructure.adapter.out.persistence.entity.AsistenciaJpaEntity;
import com.fitclub.reserva.infrastructure.adapter.out.persistence.entity.ReservaClaseJpaEntity;

public final class AsistenciaPersistenceMapper {

    private AsistenciaPersistenceMapper() {}

    public static AsistenciaJpaEntity toEntity(
            Asistencia asistencia, ReservaClaseJpaEntity reserva) {

        return new AsistenciaJpaEntity(
                asistencia.getId(),
                reserva,
                asistencia.getFechaRegistro(),
                asistencia.getPresente()
        );
    }

    public static Asistencia toDomain(AsistenciaJpaEntity entity) {
        return new Asistencia(
                entity.getId(),
                entity.getReservaClase().getId(),
                entity.getFechaRegistro(),
                entity.getPresente()
        );
    }
}
