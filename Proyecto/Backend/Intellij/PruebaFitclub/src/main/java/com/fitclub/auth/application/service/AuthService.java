package com.fitclub.auth.application.service;

import com.fitclub.auth.application.port.in.AuthUseCase;
import com.fitclub.auth.application.port.out.PasswordEncoderPort;
import com.fitclub.auth.application.port.out.TokenServicePort;
import com.fitclub.auth.application.port.out.UsuarioRepositoryPort;
import com.fitclub.auth.domain.exception.CredencialesInvalidasException;
import com.fitclub.auth.domain.model.LoginResultado;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService implements AuthUseCase {
    private final UsuarioRepositoryPort usuarioRepository;
    private final PasswordEncoderPort passwordEncoder;
    private final TokenServicePort tokenService;

    @Override
    public LoginResultado login(String email, String password) {
        var usuario = usuarioRepository.buscarPorEmail(email)
                .orElseThrow(CredencialesInvalidasException::new);

        if (!Boolean.TRUE.equals(usuario.getActivo())
                || !passwordEncoder.coincide(password, usuario.getPassword())) {
            throw new CredencialesInvalidasException();
        }

        return new LoginResultado(
                tokenService.generarToken(usuario),
                usuario.getId(),
                usuario.getNombre(),
                usuario.getEmail(),
                usuario.getRol()
        );
    }
}