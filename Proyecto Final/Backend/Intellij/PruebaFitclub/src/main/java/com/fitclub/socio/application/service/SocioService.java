package com.fitclub.socio.application.service;

import com.fitclub.socio.application.port.in.SocioUseCase;
import com.fitclub.socio.application.port.out.SocioRepositoryPort;
import com.fitclub.socio.domain.exception.SocioNoEncontradoException;
import com.fitclub.socio.domain.model.Socio;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.fitclub.shared.domain.model.Pagina;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class SocioService implements SocioUseCase {
    private final SocioRepositoryPort repository;

    @Override
    @Transactional
    public Socio registrar(Socio socio) {
        socio.setId(null);

        if (socio.getFechaRegistro() == null) {
            socio.setFechaRegistro(LocalDate.now());
        }

        return repository.guardar(socio);
    }

    @Override
    @Transactional
    public Socio actualizar(Long id, Socio socio) {
        var existente = repository.buscarPorId(id)
                .orElseThrow(() -> new SocioNoEncontradoException(id));

        existente.setNombre(socio.getNombre());
        existente.setEmail(socio.getEmail());
        existente.setTelefono(socio.getTelefono());

        return repository.guardar(existente);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Socio> listar() {
        return repository.listar();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Socio> buscarPorId(Long id) {
        return repository.buscarPorId(id);
    }

    @Override
    @Transactional(readOnly = true)
    public Pagina<Socio> buscar(String texto, int pagina, int tamanio) {
        if (pagina < 0) {
            throw new IllegalArgumentException("La página no puede ser negativa");
        }

        if (tamanio < 1 || tamanio > 100) {
            throw new IllegalArgumentException("El tamaño debe estar entre 1 y 100");
        }

        return repository.buscar(texto, pagina, tamanio);
    }
}