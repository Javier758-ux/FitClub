package com.fitclub.auth.application.service;

import com.fitclub.auth.application.port.in.UsuarioUseCase;
import com.fitclub.auth.application.port.out.PasswordEncoderPort;
import com.fitclub.auth.application.port.out.UsuarioRepositoryPort;
import com.fitclub.auth.domain.model.Rol;
import com.fitclub.auth.domain.model.Usuario;
import com.fitclub.instructor.application.port.in.InstructorUseCase;
import com.fitclub.socio.application.port.in.SocioUseCase;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UsuarioService implements UsuarioUseCase {
    private final UsuarioRepositoryPort repository;
    private final PasswordEncoderPort passwordEncoder;
    private final InstructorUseCase instructorUseCase;
    private final SocioUseCase socioUseCase;

    @Override
    public Usuario crear(
            String nombre,
            String email,
            String password,
            Rol rol,
            Long socioId,
            Long instructorId) {

        if (repository.buscarPorEmail(email).isPresent()) {
            throw new IllegalArgumentException("Ya existe un usuario con ese email");
        }

        validarPerfil(rol, socioId, instructorId);

        return repository.guardar(new Usuario(
                null,
                nombre,
                email,
                passwordEncoder.codificar(password),
                rol,
                true,
                socioId,
                instructorId
        ));
    }

    private void validarPerfil(Rol rol, Long socioId, Long instructorId) {
        if (rol == Rol.SOCIO) {
            if (socioId == null || instructorId != null) {
                throw new IllegalArgumentException("El usuario SOCIO debe estar vinculado a un socio");
            }

            socioUseCase.buscarPorId(socioId)
                    .orElseThrow(() ->
                            new IllegalArgumentException("El socio no existe"));

            if (repository.existePorSocioId(socioId)) {
                throw new IllegalArgumentException("El socio ya tiene un usuario");
            }
            return;
        }

        if (rol == Rol.INSTRUCTOR) {
            if (instructorId == null || socioId != null) {
                throw new IllegalArgumentException("El usuario INSTRUCTOR debe estar vinculado a un instructor");
            }

            instructorUseCase.buscarPorId(instructorId)
                    .orElseThrow(() ->
                            new IllegalArgumentException("El instructor no existe"));

            if (repository.existePorInstructorId(instructorId)) {
                throw new IllegalArgumentException("El instructor ya tiene un usuario");
            }
            return;
        }

        if (socioId != null || instructorId != null) {
            throw new IllegalArgumentException(
                    "ADMINISTRADOR y RECEPCION no deben tener perfil asociado"
            );
        }
    }

    @Override
    public List<Usuario> listar() {
        return repository.listar();
    }
}