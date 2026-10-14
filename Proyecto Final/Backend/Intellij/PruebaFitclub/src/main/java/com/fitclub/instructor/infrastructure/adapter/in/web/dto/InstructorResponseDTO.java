package com.fitclub.instructor.infrastructure.adapter.in.web.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter @AllArgsConstructor
public class InstructorResponseDTO {
    private Long id;
    private String nombre;
    private String email;
    private String telefono;
    private String especialidad;
}