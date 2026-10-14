package com.fitclub.auth.infrastructure.adapter.in.web.dto;

import com.fitclub.auth.domain.model.Rol;

public record UsuarioResponseDTO(
        Long id,
        String nombre,
        String email,
        Rol rol,
        Boolean activo,
        Long socioId,
        Long instructorId
) {}