package com.fitclub.auth.application.service;

import com.fitclub.auth.application.port.in.UsuarioActualUseCase;
import com.fitclub.auth.application.port.out.SesionActualPort;
import com.fitclub.auth.application.port.out.UsuarioRepositoryPort;
import com.fitclub.auth.domain.model.Rol;
import com.fitclub.auth.domain.model.Usuario;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UsuarioActualService implements UsuarioActualUseCase {
    private final SesionActualPort sesionActual;
    private final UsuarioRepositoryPort repository;

    @Override
    public Usuario obtener() {
        String email = sesionActual.obtenerEmail()
                .orElseThrow(() -> new IllegalStateException("No hay un usuario autenticado"));

        return repository.buscarPorEmail(email)
                .orElseThrow(() -> new IllegalStateException("Usuario autenticado no encontrado"));
    }

    @Override
    public Long socioId() {
        Usuario usuario = obtener();

        if (usuario.getRol() != Rol.SOCIO || usuario.getSocioId() == null) {
            throw new IllegalStateException("El usuario autenticado no pertenece a un socio");
        }

        return usuario.getSocioId();
    }

    @Override
    public Long instructorId() {
        Usuario usuario = obtener();

        if (usuario.getRol() != Rol.INSTRUCTOR || usuario.getInstructorId() == null) {
            throw new IllegalStateException("El usuario autenticado no pertenece a un instructor");
        }

        return usuario.getInstructorId();
    }
}