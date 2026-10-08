package com.fitclub.horario.infrastructure.adapter.in.web;

import com.fitclub.auth.application.port.in.UsuarioActualUseCase;
import com.fitclub.horario.application.port.in.HorarioUseCase;
import com.fitclub.horario.domain.exception.HorarioClaseNoEncontradoException;
import com.fitclub.horario.infrastructure.adapter.in.web.dto.HorarioClaseRequestDTO;
import com.fitclub.horario.infrastructure.adapter.in.web.dto.HorarioClaseResponseDTO;
import com.fitclub.horario.infrastructure.adapter.in.web.mapper.HorarioClaseWebMapper;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/horarios")
@RequiredArgsConstructor
public class HorarioClaseController {
    private final HorarioUseCase useCase;
    private final UsuarioActualUseCase usuarioActualUseCase;

    @PostMapping
    public ResponseEntity<HorarioClaseResponseDTO> crear(
            @Valid @RequestBody HorarioClaseRequestDTO request) {

        var horario = useCase.registrar(
                HorarioClaseWebMapper.toDomain(request)
        );

        return ResponseEntity.status(201)
                .body(HorarioClaseWebMapper.toResponseDTO(horario));
    }

    @GetMapping
    public List<HorarioClaseResponseDTO> listar() {
        return useCase.listar().stream()
                .map(HorarioClaseWebMapper::toResponseDTO)
                .toList();
    }

    @GetMapping("/mios")
    public List<HorarioClaseResponseDTO> misHorarios(
            @RequestParam LocalDate fecha) {

        Long instructorId = usuarioActualUseCase.instructorId();

        return useCase.listarPorInstructorYFecha(instructorId, fecha).stream()
                .map(HorarioClaseWebMapper::toResponseDTO)
                .toList();
    }

    @GetMapping("/{id}")
    public HorarioClaseResponseDTO buscarPorId(
            @PathVariable Long id) {

        var horario = useCase.buscarPorId(id)
                .orElseThrow(() ->
                        new HorarioClaseNoEncontradoException(id));

        return HorarioClaseWebMapper.toResponseDTO(horario);
    }

    @PutMapping("/{id}")
    public HorarioClaseResponseDTO actualizar(
            @PathVariable Long id,
            @Valid @RequestBody HorarioClaseRequestDTO request) {

        var horario = useCase.actualizar(
                id,
                HorarioClaseWebMapper.toDomain(request)
        );

        return HorarioClaseWebMapper.toResponseDTO(horario);
    }

    @GetMapping("/instructor/{instructorId}")
    public List<HorarioClaseResponseDTO> listarPorInstructorYFecha(
            @PathVariable Long instructorId,
            @RequestParam LocalDate fecha) {

        return useCase.listarPorInstructorYFecha(instructorId, fecha).stream()
                .map(HorarioClaseWebMapper::toResponseDTO)
                .toList();
    }
}