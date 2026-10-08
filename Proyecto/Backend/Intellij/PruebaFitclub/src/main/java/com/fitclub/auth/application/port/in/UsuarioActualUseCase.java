package com.fitclub.auth.application.port.in;

import com.fitclub.auth.domain.model.Usuario;

public interface UsuarioActualUseCase {
    Usuario obtener();
    Long socioId();
    Long instructorId();
}