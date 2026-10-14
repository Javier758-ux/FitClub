package com.fitclub.reserva.infrastructure.adapter.in.web;

import com.fitclub.auth.application.port.in.UsuarioActualUseCase;
import com.fitclub.reserva.application.port.in.ReservaClaseUseCase;
import com.fitclub.reserva.domain.exception.ReservaClaseNoEncontradaException;
import com.fitclub.reserva.domain.model.ReservaClase;
import com.fitclub.reserva.infrastructure.adapter.in.web.dto.ReservaClaseRequestDTO;
import com.fitclub.reserva.infrastructure.adapter.in.web.dto.ReservaClaseResponseDTO;
import com.fitclub.reserva.infrastructure.adapter.in.web.dto.ReservaPropiaRequestDTO;
import com.fitclub.reserva.infrastructure.adapter.in.web.mapper.ReservaClaseWebMapper;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reservas")
@RequiredArgsConstructor
public class ReservaClaseController {
    private final ReservaClaseUseCase useCase;
    private final UsuarioActualUseCase usuarioActualUseCase;

    @PostMapping
    public ResponseEntity<ReservaClaseResponseDTO> crear(
            @Valid @RequestBody ReservaClaseRequestDTO request) {

        var reserva = useCase.registrar(
                ReservaClaseWebMapper.toDomain(request)
        );

        return ResponseEntity.status(201)
                .body(ReservaClaseWebMapper.toResponseDTO(reserva));
    }

    @PostMapping("/mias")
    public ResponseEntity<ReservaClaseResponseDTO> crearPropia(
            @Valid @RequestBody ReservaPropiaRequestDTO request) {

        Long socioId = usuarioActualUseCase.socioId();

        var reserva = new ReservaClase(
                null,
                socioId,
                request.horarioClaseId(),
                null,
                null,
                null,
                false
        );

        return ResponseEntity.status(201).body(
                ReservaClaseWebMapper.toResponseDTO(
                        useCase.registrar(reserva)
                )
        );
    }

    @GetMapping
    public List<ReservaClaseResponseDTO> listar() {
        return useCase.listar().stream()
                .map(ReservaClaseWebMapper::toResponseDTO)
                .toList();
    }

    @GetMapping("/mias")
    public List<ReservaClaseResponseDTO> misReservas() {
        Long socioId = usuarioActualUseCase.socioId();

        return useCase.listarPorSocio(socioId).stream()
                .map(ReservaClaseWebMapper::toResponseDTO)
                .toList();
    }

    @GetMapping("/mis-clases/{horarioClaseId}")
    public List<ReservaClaseResponseDTO> participantesDeMiClase(
            @PathVariable Long horarioClaseId) {

        Long instructorId = usuarioActualUseCase.instructorId();

        return useCase.listarActivasPorHorarioDeInstructor(
                        horarioClaseId,
                        instructorId
                ).stream()
                .map(ReservaClaseWebMapper::toResponseDTO)
                .toList();
    }

    @GetMapping("/{id}")
    public ReservaClaseResponseDTO buscarPorId(@PathVariable Long id) {
        var reserva = useCase.buscarPorId(id)
                .orElseThrow(() ->
                        new ReservaClaseNoEncontradaException(id));

        return ReservaClaseWebMapper.toResponseDTO(reserva);
    }

    @PatchMapping("/{id}/cancelar")
    public ReservaClaseResponseDTO cancelar(@PathVariable Long id) {
        return ReservaClaseWebMapper.toResponseDTO(
                useCase.cancelar(id)
        );
    }

    @PatchMapping("/mias/{id}/cancelar")
    public ReservaClaseResponseDTO cancelarPropia(@PathVariable Long id) {
        Long socioId = usuarioActualUseCase.socioId();

        return ReservaClaseWebMapper.toResponseDTO(
                useCase.cancelarPorSocio(id, socioId)
        );
    }

    @GetMapping("/socio/{socioId}")
    public List<ReservaClaseResponseDTO> listarPorSocio(
            @PathVariable Long socioId) {

        return useCase.listarPorSocio(socioId).stream()
                .map(ReservaClaseWebMapper::toResponseDTO)
                .toList();
    }

    @GetMapping("/horario/{horarioClaseId}")
    public List<ReservaClaseResponseDTO> listarActivasPorHorario(
            @PathVariable Long horarioClaseId) {

        return useCase.listarActivasPorHorario(horarioClaseId).stream()
                .map(ReservaClaseWebMapper::toResponseDTO)
                .toList();
    }
}