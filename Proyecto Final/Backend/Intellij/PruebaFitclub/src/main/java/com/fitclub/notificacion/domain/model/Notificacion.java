package com.fitclub.notificacion.domain.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Notificacion {

    private Long id;
    private Long socioId;
    private String titulo;
    private String mensaje;
    private LocalDateTime fechaEnvio;
    private Boolean leida;
}