package com.fitclub.clase.infrastructure.adapter.out.persistence.mapper;

import com.fitclub.clase.domain.model.Clase;
import com.fitclub.clase.infrastructure.adapter.out.persistence.entity.ClaseJpaEntity;

public final class ClasePersistenceMapper {

    private ClasePersistenceMapper() {}

    public static ClaseJpaEntity toEntity(Clase clase) {
        return new ClaseJpaEntity(
                clase.getId(),
                clase.getNombre(),
                clase.getDescripcion(),
                clase.getCupoMaximo()
        );
    }

    public static Clase toDomain(ClaseJpaEntity entity) {
        return new Clase(
                entity.getId(),
                entity.getNombre(),
                entity.getDescripcion(),
                entity.getCupoMaximo()
        );
    }
}
