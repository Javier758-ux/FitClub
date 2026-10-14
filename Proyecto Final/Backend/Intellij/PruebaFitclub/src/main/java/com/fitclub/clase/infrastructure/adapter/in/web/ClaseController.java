package com.fitclub.clase.infrastructure.adapter.in.web;

import com.fitclub.clase.application.port.in.ClaseUseCase;
import com.fitclub.clase.domain.exception.ClaseNoEncontradaException;
import com.fitclub.clase.infrastructure.adapter.in.web.dto.ClaseRequestDTO;
import com.fitclub.clase.infrastructure.adapter.in.web.dto.ClaseResponseDTO;
import com.fitclub.clase.infrastructure.adapter.in.web.mapper.ClaseWebMapper;
import com.fitclub.shared.infrastructure.web.PaginaResponseDTO;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/clases")
@RequiredArgsConstructor
public class ClaseController {

    private final ClaseUseCase useCase;

    @PostMapping
    public ResponseEntity<ClaseResponseDTO> crear(
            @Valid @RequestBody ClaseRequestDTO request) {

        var clase = useCase.registrar(
                ClaseWebMapper.toDomain(request)
        );

        return ResponseEntity.status(201)
                .body(ClaseWebMapper.toResponseDTO(clase));
    }

    @GetMapping
    public PaginaResponseDTO<ClaseResponseDTO> listar(
            @RequestParam(required = false) String buscar,
            @RequestParam(defaultValue = "0") int pagina,
            @RequestParam(defaultValue = "10") int tamanio) {

        var resultado = useCase.buscar(buscar, pagina, tamanio);

        return new PaginaResponseDTO<>(
                resultado.contenido().stream()
                        .map(ClaseWebMapper::toResponseDTO)
                        .toList(),
                resultado.pagina(),
                resultado.tamanio(),
                resultado.totalElementos(),
                resultado.totalPaginas()
        );
    }

    @GetMapping("/{id}")
    public ClaseResponseDTO buscarPorId(@PathVariable Long id) {
        var clase = useCase.buscarPorId(id)
                .orElseThrow(() -> new ClaseNoEncontradaException(id));

        return ClaseWebMapper.toResponseDTO(clase);
    }

    @PutMapping("/{id}")
    public ClaseResponseDTO actualizar(
            @PathVariable Long id,
            @Valid @RequestBody ClaseRequestDTO request) {

        var clase = useCase.actualizar(
                id,
                ClaseWebMapper.toDomain(request)
        );

        return ClaseWebMapper.toResponseDTO(clase);
    }
}