package com.fitclub.auth.infrastructure.adapter.out.persistence.mapper;

import com.fitclub.auth.domain.model.Usuario;
import com.fitclub.auth.infrastructure.adapter.out.persistence.entity.UsuarioJpaEntity;

public final class UsuarioPersistenceMapper {

    private UsuarioPersistenceMapper() {}

    public static UsuarioJpaEntity toEntity(Usuario usuario) {
        return new UsuarioJpaEntity(
                usuario.getId(),
                usuario.getNombre(),
                usuario.getEmail(),
                usuario.getPassword(),
                usuario.getRol(),
                usuario.getActivo(),
                usuario.getSocioId(),
                usuario.getInstructorId()
        );
    }

    public static Usuario toDomain(UsuarioJpaEntity entity) {
        return new Usuario(
                entity.getId(),
                entity.getNombre(),
                entity.getEmail(),
                entity.getPassword(),
                entity.getRol(),
                entity.getActivo(),
                entity.getSocioId(),
                entity.getInstructorId()
        );
    }
}