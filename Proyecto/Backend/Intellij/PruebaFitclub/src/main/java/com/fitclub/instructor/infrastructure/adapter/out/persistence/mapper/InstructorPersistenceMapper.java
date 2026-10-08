package com.fitclub.instructor.infrastructure.adapter.out.persistence.mapper;

import com.fitclub.instructor.domain.model.Instructor;
import com.fitclub.instructor.infrastructure.adapter.out.persistence.entity.InstructorJpaEntity;

public final class InstructorPersistenceMapper {
    private InstructorPersistenceMapper() {}
    public static InstructorJpaEntity toEntity(Instructor instructor) {
        return new InstructorJpaEntity(
                instructor.getId(),
                instructor.getNombre(),
                instructor.getEmail(),
                instructor.getTelefono(),
                instructor.getEspecialidad()
        );
    }

    public static Instructor toDomain(InstructorJpaEntity entity) {
        return new Instructor(
                entity.getId(),
                entity.getNombre(),
                entity.getEmail(),
                entity.getTelefono(),
                entity.getEspecialidad()
        );
    }
}