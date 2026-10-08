package com.fitclub.auth.infrastructure.adapter.in.web.dto;

import com.fitclub.auth.domain.model.Rol;
import jakarta.validation.constraints.*;

public record UsuarioRequestDTO(
        @NotBlank String nombre,
        @NotBlank @Email String email,
        @NotBlank @Size(min = 8) String password,
        @NotNull Rol rol,
        Long socioId,
        Long instructorId
) {}