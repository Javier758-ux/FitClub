package com.fitclub.clase.application.service;

import com.fitclub.clase.application.port.in.ClaseUseCase;
import com.fitclub.clase.application.port.out.ClaseRepositoryPort;
import com.fitclub.clase.domain.exception.ClaseNoEncontradaException;
import com.fitclub.clase.domain.model.Clase;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.fitclub.shared.domain.model.Pagina;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ClaseService implements ClaseUseCase {
    private final ClaseRepositoryPort repository;

    @Override
    @Transactional
    public Clase registrar(Clase clase) {
        clase.setId(null);
        return repository.guardar(clase);
    }

    @Override
    @Transactional
    public Clase actualizar(Long id, Clase clase) {
        var existente = repository.buscarPorId(id)
                .orElseThrow(() -> new ClaseNoEncontradaException(id));

        existente.setNombre(clase.getNombre());
        existente.setDescripcion(clase.getDescripcion());
        existente.setCupoMaximo(clase.getCupoMaximo());

        return repository.guardar(existente);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Clase> listar() {
        return repository.listar();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Clase> buscarPorId(Long id) {
        return repository.buscarPorId(id);
    }

    @Override
    @Transactional(readOnly = true)
    public Pagina<Clase> buscar(String texto, int pagina, int tamanio) {
        if (pagina < 0) {
            throw new IllegalArgumentException("La página no puede ser negativa");
        }

        if (tamanio < 1 || tamanio > 100) {
            throw new IllegalArgumentException("El tamaño debe estar entre 1 y 100");
        }

        return repository.buscar(texto, pagina, tamanio);
    }
}