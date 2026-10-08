package com.fitclub.historialmembresia.infrastructure.adapter.in.web;

import com.fitclub.historialmembresia.application.port.in.HistorialMembresiaUseCase;
import com.fitclub.historialmembresia.domain.exception.HistorialMembresiaNoEncontradoException;
import com.fitclub.historialmembresia.infrastructure.adapter.in.web.dto.HistorialMembresiaResponseDTO;
import com.fitclub.historialmembresia.infrastructure.adapter.in.web.mapper.HistorialMembresiaWebMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/historial-membresias")
@RequiredArgsConstructor
public class HistorialMembresiaController {
    private final HistorialMembresiaUseCase useCase;

    @GetMapping
    public List<HistorialMembresiaResponseDTO> listar() {
        return useCase.listar().stream()
                .map(HistorialMembresiaWebMapper::toResponseDTO)
                .toList();
    }

    @GetMapping("/{id}")
    public HistorialMembresiaResponseDTO buscarPorId(@PathVariable Long id) {
        var historial = useCase.buscarPorId(id).orElseThrow(() ->
                        new HistorialMembresiaNoEncontradoException(id));

        return HistorialMembresiaWebMapper.toResponseDTO(historial);
    }
}