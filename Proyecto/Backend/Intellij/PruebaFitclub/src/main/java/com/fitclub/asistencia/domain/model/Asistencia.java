package com.fitclub.asistencia.domain.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Asistencia {

    private Long id;
    private Long reservaClaseId;
    private LocalDateTime fechaRegistro;
    private Boolean presente;
}