package com.fitclub.asistencia.infrastructure.adapter.in.web;

import com.fitclub.asistencia.application.port.in.AsistenciaUseCase;
import com.fitclub.asistencia.domain.exception.AsistenciaNoEncontradaException;
import com.fitclub.asistencia.infrastructure.adapter.in.web.dto.AsistenciaRequestDTO;
import com.fitclub.asistencia.infrastructure.adapter.in.web.dto.AsistenciaResponseDTO;
import com.fitclub.asistencia.infrastructure.adapter.in.web.mapper.AsistenciaWebMapper;
import com.fitclub.auth.application.port.in.UsuarioActualUseCase;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/asistencias")
@RequiredArgsConstructor
public class AsistenciaController {
    private final AsistenciaUseCase useCase;
    private final UsuarioActualUseCase usuarioActualUseCase;

    @PostMapping
    public ResponseEntity<AsistenciaResponseDTO> crear(
            @Valid @RequestBody AsistenciaRequestDTO request) {

        var guardada = useCase.registrar(
                AsistenciaWebMapper.toDomain(request)
        );

        return ResponseEntity.status(201)
                .body(AsistenciaWebMapper.toResponseDTO(guardada));
    }

    @PostMapping("/mis-clases")
    public ResponseEntity<AsistenciaResponseDTO> crearPorInstructor(
            @Valid @RequestBody AsistenciaRequestDTO request) {

        Long instructorId = usuarioActualUseCase.instructorId();

        var guardada = useCase.registrarPorInstructor(
                AsistenciaWebMapper.toDomain(request),
                instructorId
        );

        return ResponseEntity.status(201)
                .body(AsistenciaWebMapper.toResponseDTO(guardada));
    }

    @GetMapping
    public List<AsistenciaResponseDTO> listar() {
        return useCase.listar().stream()
                .map(AsistenciaWebMapper::toResponseDTO)
                .toList();
    }

    @GetMapping("/{id}")
    public AsistenciaResponseDTO buscarPorId(@PathVariable Long id) {
        var asistencia = useCase.buscarPorId(id)
                .orElseThrow(() ->
                        new AsistenciaNoEncontradaException(id));

        return AsistenciaWebMapper.toResponseDTO(asistencia);
    }
}