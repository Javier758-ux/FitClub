package com.fitclub.auth.application.port.out;

import com.fitclub.auth.domain.model.Usuario;

public interface TokenServicePort {
    String generarToken(Usuario usuario);
    String extraerEmail(String token);
    boolean esValido(String token, Usuario usuario);
}