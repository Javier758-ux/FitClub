package com.fitclub.auth.domain.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Usuario {
    private Long id;
    private String nombre;
    private String email;
    private String password;
    private Rol rol;
    private Boolean activo;
    private Long socioId;
    private Long instructorId;
}