package com.fitclub.instructor.application.service;

import com.fitclub.instructor.application.port.in.InstructorUseCase;
import com.fitclub.instructor.application.port.out.InstructorRepositoryPort;
import com.fitclub.instructor.domain.exception.InstructorNoEncontradoException;
import com.fitclub.instructor.domain.model.Instructor;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.fitclub.shared.domain.model.Pagina;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class InstructorService implements InstructorUseCase {
    private final InstructorRepositoryPort repository;

    @Override
    @Transactional
    public Instructor registrar(Instructor instructor) {
        instructor.setId(null);
        return repository.guardar(instructor);
    }

    @Override
    @Transactional
    public Instructor actualizar(Long id, Instructor instructor) {
        var existente = repository.buscarPorId(id)
                .orElseThrow(() -> new InstructorNoEncontradoException(id));

        existente.setNombre(instructor.getNombre());
        existente.setEmail(instructor.getEmail());
        existente.setTelefono(instructor.getTelefono());
        existente.setEspecialidad(instructor.getEspecialidad());

        return repository.guardar(existente);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Instructor> listar() {
        return repository.listar();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Instructor> buscarPorId(Long id) {
        return repository.buscarPorId(id);
    }

    @Override
    @Transactional(readOnly = true)
    public Pagina<Instructor> buscar(String texto, int pagina, int tamanio) {
        if (pagina < 0) {
            throw new IllegalArgumentException("La página no puede ser negativa");
        }

        if (tamanio < 1 || tamanio > 100) {
            throw new IllegalArgumentException("El tamaño debe estar entre 1 y 100");
        }

        return repository.buscar(texto, pagina, tamanio);
    }
}