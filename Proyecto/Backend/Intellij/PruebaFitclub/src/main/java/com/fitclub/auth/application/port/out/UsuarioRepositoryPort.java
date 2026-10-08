package com.fitclub.auth.application.port.out;

import com.fitclub.auth.domain.model.Usuario;

import java.util.List;
import java.util.Optional;

public interface UsuarioRepositoryPort {
    Usuario guardar(Usuario usuario);
    Optional<Usuario> buscarPorEmail(String email);
    Optional<Usuario> buscarPorId(Long id);
    List<Usuario> listar();
    boolean existePorSocioId(Long socioId);
    boolean existePorInstructorId(Long instructorId);
}