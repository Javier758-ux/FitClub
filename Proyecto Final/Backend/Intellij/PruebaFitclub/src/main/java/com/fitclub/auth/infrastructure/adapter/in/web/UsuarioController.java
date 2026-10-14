package com.fitclub.auth.infrastructure.adapter.in.web;

import com.fitclub.auth.application.port.in.UsuarioUseCase;
import com.fitclub.auth.infrastructure.adapter.in.web.dto.UsuarioRequestDTO;
import com.fitclub.auth.infrastructure.adapter.in.web.dto.UsuarioResponseDTO;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
@RequiredArgsConstructor
public class UsuarioController {
    private final UsuarioUseCase useCase;

    @PostMapping
    public ResponseEntity<UsuarioResponseDTO> crear(
            @Valid @RequestBody UsuarioRequestDTO request) {

        var usuario = useCase.crear(
                request.nombre(),
                request.email(),
                request.password(),
                request.rol(),
                request.socioId(),
                request.instructorId()
        );

        return ResponseEntity.status(201).body(
                new UsuarioResponseDTO(
                        usuario.getId(),
                        usuario.getNombre(),
                        usuario.getEmail(),
                        usuario.getRol(),
                        usuario.getActivo(),
                        usuario.getSocioId(),
                        usuario.getInstructorId()
                )
        );
    }

    @GetMapping
    public List<UsuarioResponseDTO> listar() {
        return useCase.listar().stream()
                .map(usuario -> new UsuarioResponseDTO(
                        usuario.getId(),
                        usuario.getNombre(),
                        usuario.getEmail(),
                        usuario.getRol(),
                        usuario.getActivo(),
                        usuario.getSocioId(),
                        usuario.getInstructorId()
                ))
                .toList();
    }
}