package com.fitclub.historialmembresia.application.service;

import com.fitclub.historialmembresia.application.port.in.HistorialMembresiaUseCase;
import com.fitclub.historialmembresia.application.port.out.HistorialMembresiaRepositoryPort;
import com.fitclub.historialmembresia.domain.model.HistorialMembresia;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class HistorialMembresiaService implements HistorialMembresiaUseCase {

    private final HistorialMembresiaRepositoryPort repository;

    @Override
    @Transactional
    public HistorialMembresia registrar(
            HistorialMembresia historial) {

        historial.setId(null);
        historial.setFechaCambio(LocalDateTime.now());

        return repository.guardar(historial);
    }

    @Override
    @Transactional(readOnly = true)
    public List<HistorialMembresia> listar() {
        return repository.listar();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<HistorialMembresia> buscarPorId(Long id) {
        return repository.buscarPorId(id);
    }
}