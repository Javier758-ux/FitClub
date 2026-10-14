package com.fitclub.auth.infrastructure.adapter.in.web.dto;

import com.fitclub.auth.domain.model.Rol;

public record UsuarioActualResponseDTO(
        Long id,
        String nombre,
        String email,
        Rol rol,
        Long socioId,
        Long instructorId
) {}