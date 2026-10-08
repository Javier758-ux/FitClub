package com.fitclub.notificacion.infrastructure.adapter.in.web;

import com.fitclub.auth.application.port.in.UsuarioActualUseCase;
import com.fitclub.notificacion.application.port.in.NotificacionUseCase;
import com.fitclub.notificacion.domain.exception.NotificacionNoEncontradaException;
import com.fitclub.notificacion.infrastructure.adapter.in.web.dto.NotificacionRequestDTO;
import com.fitclub.notificacion.infrastructure.adapter.in.web.dto.NotificacionResponseDTO;
import com.fitclub.notificacion.infrastructure.adapter.in.web.mapper.NotificacionWebMapper;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notificaciones")
@RequiredArgsConstructor
public class NotificacionController {
    private final NotificacionUseCase useCase;
    private final UsuarioActualUseCase usuarioActualUseCase;

    @PostMapping
    public ResponseEntity<NotificacionResponseDTO> crear(
            @Valid @RequestBody NotificacionRequestDTO request) {

        var notificacion = useCase.registrar(
                NotificacionWebMapper.toDomain(request)
        );

        return ResponseEntity.status(201)
                .body(NotificacionWebMapper.toResponseDTO(notificacion));
    }

    @GetMapping
    public List<NotificacionResponseDTO> listar(
            @RequestParam(required = false) Long socioId) {

        var notificaciones = socioId == null
                ? useCase.listar()
                : useCase.listarPorSocio(socioId);

        return notificaciones.stream()
                .map(NotificacionWebMapper::toResponseDTO)
                .toList();
    }

    @GetMapping("/mias")
    public List<NotificacionResponseDTO> misNotificaciones() {
        Long socioId = usuarioActualUseCase.socioId();

        return useCase.listarPorSocio(socioId).stream()
                .map(NotificacionWebMapper::toResponseDTO)
                .toList();
    }

    @GetMapping("/{id}")
    public NotificacionResponseDTO buscarPorId(
            @PathVariable Long id) {

        var notificacion = useCase.buscarPorId(id)
                .orElseThrow(() ->
                        new NotificacionNoEncontradaException(id));

        return NotificacionWebMapper.toResponseDTO(notificacion);
    }

    @PatchMapping("/{id}/leer")
    public NotificacionResponseDTO marcarComoLeida(
            @PathVariable Long id) {

        return NotificacionWebMapper.toResponseDTO(
                useCase.marcarComoLeida(id)
        );
    }

    @PatchMapping("/mias/{id}/leer")
    public NotificacionResponseDTO marcarPropiaComoLeida(
            @PathVariable Long id) {

        Long socioId = usuarioActualUseCase.socioId();

        return NotificacionWebMapper.toResponseDTO(
                useCase.marcarComoLeidaPorSocio(id, socioId)
        );
    }
}