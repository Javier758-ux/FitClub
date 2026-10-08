package com.fitclub.plan.infrastructure.adapter.out.persistence.mapper;

import com.fitclub.plan.domain.model.Plan;
import com.fitclub.plan.infrastructure.adapter.out.persistence.entity.PlanJpaEntity;

public final class PlanPersistenceMapper {

    public static PlanJpaEntity toEntity(Plan plan) {
        return new PlanJpaEntity(
                plan.getId(),
                plan.getNombre(),
                plan.getDescripcion(),
                plan.getPrecio(),
                plan.getDuracionDias()
        );
    }

    public static Plan toDomain(PlanJpaEntity entity) {
        return new Plan(
                entity.getId(),
                entity.getNombre(),
                entity.getDescripcion(),
                entity.getPrecio(),
                entity.getDuracionDias()
        );
    }
}
