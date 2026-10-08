package com.fitclub.auth.infrastructure.security;

import com.fitclub.auth.application.port.out.PasswordEncoderPort;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class BCryptPasswordEncoderAdapter implements PasswordEncoderPort {
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    @Override
    public String codificar(String password) {
        return encoder.encode(password);
    }

    @Override
    public boolean coincide(String password, String passwordCodificado) {
        return encoder.matches(password, passwordCodificado);
    }
}