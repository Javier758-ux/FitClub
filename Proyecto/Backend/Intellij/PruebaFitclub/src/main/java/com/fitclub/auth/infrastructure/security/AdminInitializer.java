package com.fitclub.auth.infrastructure.security;

import com.fitclub.auth.application.port.out.PasswordEncoderPort;
import com.fitclub.auth.application.port.out.UsuarioRepositoryPort;
import com.fitclub.auth.domain.model.Rol;
import com.fitclub.auth.domain.model.Usuario;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AdminInitializer implements ApplicationRunner {
    private final UsuarioRepositoryPort repository;
    private final PasswordEncoderPort passwordEncoder;

    @Value("${fitclub.admin.email}")
    private String email;

    @Value("${fitclub.admin.password}")
    private String password;

    @Override
    public void run(ApplicationArguments args) {
        if (repository.buscarPorEmail(email).isEmpty()) {
            repository.guardar(new Usuario(
                    null,
                    "Administrador",
                    email,
                    passwordEncoder.codificar(password),
                    Rol.ADMINISTRADOR,
                    true,
                    null,
                    null
            ));
        }
    }
}