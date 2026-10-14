package com.fitclub.auth.application.port.in;

import com.fitclub.auth.domain.model.Rol;
import com.fitclub.auth.domain.model.Usuario;

import java.util.List;

public interface UsuarioUseCase {
    Usuario crear(
            String nombre,
            String email,
            String password,
            Rol rol,
            Long socioId,
            Long instructorId
    );

    List<Usuario> listar();
}