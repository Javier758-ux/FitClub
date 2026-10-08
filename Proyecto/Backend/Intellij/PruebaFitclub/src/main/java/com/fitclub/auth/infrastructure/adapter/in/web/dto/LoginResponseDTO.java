package com.fitclub.auth.infrastructure.adapter.in.web.dto;

import com.fitclub.auth.domain.model.Rol;

public record LoginResponseDTO(
        String token,
        String tipo,
        Long usuarioId,
        String nombre,
        String email,
        Rol rol
) {}