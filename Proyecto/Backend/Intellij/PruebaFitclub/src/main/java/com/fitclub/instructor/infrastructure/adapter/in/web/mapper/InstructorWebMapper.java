package com.fitclub.instructor.infrastructure.adapter.in.web.mapper;

import com.fitclub.instructor.domain.model.Instructor;
import com.fitclub.instructor.infrastructure.adapter.in.web.dto.InstructorRequestDTO;
import com.fitclub.instructor.infrastructure.adapter.in.web.dto.InstructorResponseDTO;

public final class InstructorWebMapper {
    private InstructorWebMapper() {}
    public static Instructor toDomain(InstructorRequestDTO dto) {
        return new Instructor(
                null,
                dto.getNombre(),
                dto.getEmail(),
                dto.getTelefono(),
                dto.getEspecialidad()
        );
    }

    public static InstructorResponseDTO toResponseDTO(
            Instructor instructor) {

        return new InstructorResponseDTO(
                instructor.getId(),
                instructor.getNombre(),
                instructor.getEmail(),
                instructor.getTelefono(),
                instructor.getEspecialidad()
        );
    }
}