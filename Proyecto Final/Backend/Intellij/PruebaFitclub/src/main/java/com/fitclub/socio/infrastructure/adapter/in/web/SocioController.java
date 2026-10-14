package com.fitclub.socio.infrastructure.adapter.in.web;

import com.fitclub.shared.infrastructure.web.PaginaResponseDTO;
import com.fitclub.socio.application.port.in.SocioUseCase;
import com.fitclub.socio.domain.exception.SocioNoEncontradoException;
import com.fitclub.socio.domain.model.Socio;
import com.fitclub.socio.infrastructure.adapter.in.web.dto.SocioRequestDTO;
import com.fitclub.socio.infrastructure.adapter.in.web.dto.SocioResponseDTO;
import com.fitclub.socio.infrastructure.adapter.in.web.mapper.SocioWebMapper;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/socios")
public class SocioController {

    private final SocioUseCase socioUseCase;

    public SocioController(SocioUseCase socioUseCase) {
        this.socioUseCase = socioUseCase;
    }

    @PostMapping
    public ResponseEntity<SocioResponseDTO> crear(
            @Valid @RequestBody SocioRequestDTO request) {

        Socio guardado = socioUseCase.registrar(
                SocioWebMapper.toDomain(request)
        );

        return ResponseEntity.status(201)
                .body(SocioWebMapper.toResponseDTO(guardado));
    }

    @GetMapping
    public PaginaResponseDTO<SocioResponseDTO> listar(
            @RequestParam(required = false) String buscar,
            @RequestParam(defaultValue = "0") int pagina,
            @RequestParam(defaultValue = "10") int tamanio) {

        var resultado = socioUseCase.buscar(
                buscar,
                pagina,
                tamanio
        );

        return new PaginaResponseDTO<>(
                resultado.contenido().stream()
                        .map(SocioWebMapper::toResponseDTO)
                        .toList(),
                resultado.pagina(),
                resultado.tamanio(),
                resultado.totalElementos(),
                resultado.totalPaginas()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<SocioResponseDTO> buscarPorId(
            @PathVariable Long id) {

        Socio socio = socioUseCase.buscarPorId(id)
                .orElseThrow(() -> new SocioNoEncontradoException(id));

        return ResponseEntity.ok(
                SocioWebMapper.toResponseDTO(socio)
        );
    }

    @PutMapping("/{id}")
    public SocioResponseDTO actualizar(
            @PathVariable Long id,
            @Valid @RequestBody SocioRequestDTO request) {

        var socio = socioUseCase.actualizar(
                id,
                SocioWebMapper.toDomain(request)
        );

        return SocioWebMapper.toResponseDTO(socio);
    }
}