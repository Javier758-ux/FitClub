package com.fitclub.instructor.infrastructure.adapter.in.web;

import com.fitclub.instructor.application.port.in.InstructorUseCase;
import com.fitclub.instructor.domain.exception.InstructorNoEncontradoException;
import com.fitclub.instructor.infrastructure.adapter.in.web.dto.InstructorRequestDTO;
import com.fitclub.instructor.infrastructure.adapter.in.web.dto.InstructorResponseDTO;
import com.fitclub.instructor.infrastructure.adapter.in.web.mapper.InstructorWebMapper;
import com.fitclub.shared.infrastructure.web.PaginaResponseDTO;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/instructores")
@RequiredArgsConstructor
public class InstructorController {

    private final InstructorUseCase useCase;

    @PostMapping
    public ResponseEntity<InstructorResponseDTO> crear(
            @Valid @RequestBody InstructorRequestDTO request) {

        var instructor = useCase.registrar(
                InstructorWebMapper.toDomain(request)
        );

        return ResponseEntity.status(201)
                .body(InstructorWebMapper.toResponseDTO(instructor));
    }

    @GetMapping
    public PaginaResponseDTO<InstructorResponseDTO> listar(
            @RequestParam(required = false) String buscar,
            @RequestParam(defaultValue = "0") int pagina,
            @RequestParam(defaultValue = "10") int tamanio) {

        var resultado = useCase.buscar(buscar, pagina, tamanio);

        return new PaginaResponseDTO<>(
                resultado.contenido().stream()
                        .map(InstructorWebMapper::toResponseDTO)
                        .toList(),
                resultado.pagina(),
                resultado.tamanio(),
                resultado.totalElementos(),
                resultado.totalPaginas()
        );
    }

    @GetMapping("/{id}")
    public InstructorResponseDTO buscarPorId(
            @PathVariable Long id) {

        var instructor = useCase.buscarPorId(id)
                .orElseThrow(() ->
                        new InstructorNoEncontradoException(id));

        return InstructorWebMapper.toResponseDTO(instructor);
    }

    @PutMapping("/{id}")
    public InstructorResponseDTO actualizar(
            @PathVariable Long id,
            @Valid @RequestBody InstructorRequestDTO request) {

        var instructor = useCase.actualizar(
                id,
                InstructorWebMapper.toDomain(request)
        );

        return InstructorWebMapper.toResponseDTO(instructor);
    }
}