package com.fitclub.horario.infrastructure.adapter.out.persistence.mapper;

import com.fitclub.clase.infrastructure.adapter.out.persistence.entity.ClaseJpaEntity;
import com.fitclub.horario.domain.model.HorarioClase;
import com.fitclub.horario.infrastructure.adapter.out.persistence.entity.HorarioClaseJpaEntity;
import com.fitclub.instructor.infrastructure.adapter.out.persistence.entity.InstructorJpaEntity;

public final class HorarioClasePersistenceMapper {
    private HorarioClasePersistenceMapper() {}
    public static HorarioClaseJpaEntity toEntity(
            HorarioClase horario,
            ClaseJpaEntity clase,
            InstructorJpaEntity instructor) {

        return new HorarioClaseJpaEntity(
                horario.getId(),
                clase,
                instructor,
                horario.getFecha(),
                horario.getHoraInicio(),
                horario.getHoraFin()
        );
    }

    public static HorarioClase toDomain(HorarioClaseJpaEntity entity) {

        return new HorarioClase(
                entity.getId(),
                entity.getClase().getId(),
                entity.getInstructor().getId(),
                entity.getFecha(),
                entity.getHoraInicio(),
                entity.getHoraFin()
        );
    }
}