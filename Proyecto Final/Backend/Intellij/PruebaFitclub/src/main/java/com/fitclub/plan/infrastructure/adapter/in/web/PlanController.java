package com.fitclub.plan.infrastructure.adapter.in.web;

import com.fitclub.plan.application.port.in.PlanUseCase;
import com.fitclub.plan.domain.exception.PlanNoEncontradoException;
import com.fitclub.plan.infrastructure.adapter.in.web.dto.PlanRequestDTO;
import com.fitclub.plan.infrastructure.adapter.in.web.dto.PlanResponseDTO;
import com.fitclub.plan.infrastructure.adapter.in.web.mapper.PlanWebMapper;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/planes")
@RequiredArgsConstructor
public class PlanController {
    private final PlanUseCase useCase;

    @PostMapping
    public ResponseEntity<PlanResponseDTO> crear(
            @Valid @RequestBody PlanRequestDTO request) {

        var plan = useCase.registrar(
                PlanWebMapper.toDomain(request)
        );

        return ResponseEntity.status(201)
                .body(PlanWebMapper.toResponseDTO(plan));
    }

    @GetMapping
    public List<PlanResponseDTO> listar() {
        return useCase.listar().stream()
                .map(PlanWebMapper::toResponseDTO)
                .toList();
    }

    @GetMapping("/{id}")
    public PlanResponseDTO buscarPorId(@PathVariable Long id) {

        var plan = useCase.buscarPorId(id)
                .orElseThrow(() ->
                        new PlanNoEncontradoException(id));

        return PlanWebMapper.toResponseDTO(plan);
    }

    @PutMapping("/{id}")
    public PlanResponseDTO actualizar(
            @PathVariable Long id,
            @Valid @RequestBody PlanRequestDTO request) {

        var plan = useCase.actualizar(
                id,
                PlanWebMapper.toDomain(request)
        );

        return PlanWebMapper.toResponseDTO(plan);
    }
}