package com.fitclub.instructor.domain.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Instructor {

    private Long id;
    private String nombre;
    private String email;
    private String telefono;
    private String especialidad;
}