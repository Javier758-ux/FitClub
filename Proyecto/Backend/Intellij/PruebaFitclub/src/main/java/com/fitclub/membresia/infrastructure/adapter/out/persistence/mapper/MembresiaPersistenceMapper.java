package com.fitclub.membresia.infrastructure.adapter.out.persistence.mapper;

import com.fitclub.membresia.domain.model.Membresia;
import com.fitclub.membresia.infrastructure.adapter.out.persistence.entity.MembresiaJpaEntity;
import com.fitclub.plan.infrastructure.adapter.out.persistence.entity.PlanJpaEntity;
import com.fitclub.socio.infrastructure.adapter.out.persistence.entity.SocioJpaEntity;

public final class MembresiaPersistenceMapper {
    private MembresiaPersistenceMapper() {}
    public static MembresiaJpaEntity toEntity(
            Membresia membresia,
            SocioJpaEntity socio,
            PlanJpaEntity plan) {

        return new MembresiaJpaEntity(
                membresia.getId(),
                socio,
                plan,
                membresia.getFechaInicio(),
                membresia.getFechaFin(),
                membresia.getEstado()
        );
    }

    public static Membresia toDomain(MembresiaJpaEntity entity) {

        return new Membresia(
                entity.getId(),
                entity.getSocio().getId(),
                entity.getPlan().getId(),
                entity.getFechaInicio(),
                entity.getFechaFin(),
                entity.getEstado()
        );
    }
}