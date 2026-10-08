package com.fitclub.instructor.infrastructure.adapter.out.persistence;

import com.fitclub.instructor.application.port.out.InstructorRepositoryPort;
import com.fitclub.instructor.domain.model.Instructor;
import com.fitclub.instructor.infrastructure.adapter.out.persistence.mapper.InstructorPersistenceMapper;
import com.fitclub.instructor.infrastructure.adapter.out.persistence.repository.SpringDataInstructorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import com.fitclub.shared.domain.model.Pagina;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;

import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class InstructorPersistenceAdapter implements InstructorRepositoryPort {
    private final SpringDataInstructorRepository repository;

    @Override
    public Instructor guardar(Instructor instructor) {
        return InstructorPersistenceMapper.toDomain(
                repository.save(
                        InstructorPersistenceMapper.toEntity(instructor)
                )
        );
    }

    @Override
    public List<Instructor> listar() {
        return repository.findAll().stream()
                .map(InstructorPersistenceMapper::toDomain)
                .toList();
    }

    @Override
    public Optional<Instructor> buscarPorId(Long id) {
        return repository.findById(id)
                .map(InstructorPersistenceMapper::toDomain);
    }

    @Override
    public Pagina<Instructor> buscar(String texto, int pagina, int tamanio) {
        var pageable = PageRequest.of(
                pagina,
                tamanio,
                Sort.by("nombre").ascending()
        );

        var resultado = texto == null || texto.isBlank()
                ? repository.findAll(pageable)
                : repository.findByNombreContainingIgnoreCaseOrEmailContainingIgnoreCaseOrEspecialidadContainingIgnoreCase(
                texto,
                texto,
                texto,
                pageable
        );

        return new Pagina<>(
                resultado.getContent().stream()
                        .map(InstructorPersistenceMapper::toDomain)
                        .toList(),
                resultado.getNumber(),
                resultado.getSize(),
                resultado.getTotalElements(),
                resultado.getTotalPages()
        );
    }
}