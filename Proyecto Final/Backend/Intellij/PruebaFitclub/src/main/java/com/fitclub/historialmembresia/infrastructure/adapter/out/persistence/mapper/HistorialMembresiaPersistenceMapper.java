package com.fitclub.historialmembresia.infrastructure.adapter.out.persistence.mapper;

import com.fitclub.historialmembresia.domain.model.HistorialMembresia;
import com.fitclub.historialmembresia.infrastructure.adapter.out.persistence.entity.HistorialMembresiaJpaEntity;
import com.fitclub.membresia.infrastructure.adapter.out.persistence.entity.MembresiaJpaEntity;

public final class HistorialMembresiaPersistenceMapper {

    private HistorialMembresiaPersistenceMapper() {}

    public static HistorialMembresiaJpaEntity toEntity(
            HistorialMembresia historial,
            MembresiaJpaEntity membresia) {

        return new HistorialMembresiaJpaEntity(
                historial.getId(),
                membresia,
                historial.getEstadoAnterior(),
                historial.getEstadoNuevo(),
                historial.getFechaCambio(),
                historial.getMotivo(),
                historial.getUsuarioEmail()
        );
    }

    public static HistorialMembresia toDomain(
            HistorialMembresiaJpaEntity entity) {

        return new HistorialMembresia(
                entity.getId(),
                entity.getMembresia().getId(),
                entity.getEstadoAnterior(),
                entity.getEstadoNuevo(),
                entity.getFechaCambio(),
                entity.getMotivo(),
                entity.getUsuarioEmail()
        );
    }
}