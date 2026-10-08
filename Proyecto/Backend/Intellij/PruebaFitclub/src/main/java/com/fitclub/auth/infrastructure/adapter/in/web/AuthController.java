package com.fitclub.auth.infrastructure.adapter.in.web;

import com.fitclub.auth.application.port.in.AuthUseCase;
import com.fitclub.auth.application.port.in.UsuarioActualUseCase;
import com.fitclub.auth.infrastructure.adapter.in.web.dto.LoginRequestDTO;
import com.fitclub.auth.infrastructure.adapter.in.web.dto.LoginResponseDTO;
import com.fitclub.auth.infrastructure.adapter.in.web.dto.UsuarioActualResponseDTO;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthUseCase useCase;
    private final UsuarioActualUseCase usuarioActualUseCase;

    @PostMapping("/login")
    public LoginResponseDTO login(
            @Valid @RequestBody LoginRequestDTO request) {

        var resultado = useCase.login(
                request.email(),
                request.password()
        );

        return new LoginResponseDTO(
                resultado.token(),
                "Bearer",
                resultado.usuarioId(),
                resultado.nombre(),
                resultado.email(),
                resultado.rol()
        );
    }

    @GetMapping("/me")
    public UsuarioActualResponseDTO me() {
        var usuario = usuarioActualUseCase.obtener();

        return new UsuarioActualResponseDTO(
                usuario.getId(),
                usuario.getNombre(),
                usuario.getEmail(),
                usuario.getRol(),
                usuario.getSocioId(),
                usuario.getInstructorId()
        );
    }
}