package com.fitclub.asistencia.infrastructure.adapter.in.web.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter @NoArgsConstructor
public class AsistenciaRequestDTO {
    @NotNull
    @Positive
    private Long reservaClaseId;

    @NotNull
    private Boolean presente;
}
