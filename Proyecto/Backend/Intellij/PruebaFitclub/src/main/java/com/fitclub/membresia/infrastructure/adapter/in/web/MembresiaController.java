package com.fitclub.membresia.infrastructure.adapter.in.web;

import com.fitclub.auth.application.port.in.UsuarioActualUseCase;
import com.fitclub.membresia.application.port.in.MembresiaUseCase;
import com.fitclub.membresia.domain.exception.MembresiaNoEncontradaException;
import com.fitclub.membresia.domain.model.EstadoMembresia;
import com.fitclub.membresia.domain.model.Membresia;
import com.fitclub.membresia.infrastructure.adapter.in.web.dto.MembresiaRequestDTO;
import com.fitclub.membresia.infrastructure.adapter.in.web.dto.MembresiaResponseDTO;
import com.fitclub.membresia.infrastructure.adapter.in.web.mapper.MembresiaWebMapper;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/membresias")
public class MembresiaController {

    private final MembresiaUseCase membresiaUseCase;
    private final UsuarioActualUseCase usuarioActualUseCase;

    public MembresiaController(
            MembresiaUseCase membresiaUseCase,
            UsuarioActualUseCase usuarioActualUseCase) {
        this.membresiaUseCase = membresiaUseCase;
        this.usuarioActualUseCase = usuarioActualUseCase;
    }

    @PostMapping
    public ResponseEntity<MembresiaResponseDTO> crear(
            @Valid @RequestBody MembresiaRequestDTO request) {

        Membresia guardado = membresiaUseCase.registrar(
                MembresiaWebMapper.toDomain(request)
        );

        return ResponseEntity.status(201)
                .body(MembresiaWebMapper.toResponseDTO(guardado));
    }

    @GetMapping
    public List<MembresiaResponseDTO> listar(
            @RequestParam(required = false) Long socioId,
            @RequestParam(required = false) EstadoMembresia estado) {

        return membresiaUseCase.filtrar(socioId, estado).stream()
                .map(MembresiaWebMapper::toResponseDTO)
                .toList();
    }

    @GetMapping("/mias")
    public List<MembresiaResponseDTO> misMembresias() {
        Long socioId = usuarioActualUseCase.socioId();

        return membresiaUseCase.filtrar(socioId, null).stream()
                .map(MembresiaWebMapper::toResponseDTO)
                .toList();
    }

    @GetMapping("/{id}")
    public ResponseEntity<MembresiaResponseDTO> buscarPorId(
            @PathVariable Long id) {

        Membresia membresia = membresiaUseCase.buscarPorId(id)
                .orElseThrow(() -> new MembresiaNoEncontradaException(id));

        return ResponseEntity.ok(
                MembresiaWebMapper.toResponseDTO(membresia)
        );
    }

    @PatchMapping("/{id}/suspender")
    public ResponseEntity<MembresiaResponseDTO> suspender(
            @PathVariable Long id) {

        Membresia membresia = membresiaUseCase.suspender(id);

        return ResponseEntity.ok(
                MembresiaWebMapper.toResponseDTO(membresia)
        );
    }

    @PatchMapping("/{id}/cancelar")
    public ResponseEntity<MembresiaResponseDTO> cancelar(
            @PathVariable Long id) {

        Membresia membresia = membresiaUseCase.cancelar(id);

        return ResponseEntity.ok(
                MembresiaWebMapper.toResponseDTO(membresia)
        );
    }

    @PatchMapping("/{id}/reactivar")
    public ResponseEntity<MembresiaResponseDTO> reactivar(
            @PathVariable Long id) {

        Membresia membresia = membresiaUseCase.reactivar(id);

        return ResponseEntity.ok(
                MembresiaWebMapper.toResponseDTO(membresia)
        );
    }
}