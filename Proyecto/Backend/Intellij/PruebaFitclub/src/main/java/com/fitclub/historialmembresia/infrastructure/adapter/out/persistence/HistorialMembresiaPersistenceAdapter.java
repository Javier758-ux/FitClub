package com.fitclub.historialmembresia.infrastructure.adapter.out.persistence;

import com.fitclub.historialmembresia.application.port.out.HistorialMembresiaRepositoryPort;
import com.fitclub.historialmembresia.domain.model.HistorialMembresia;
import com.fitclub.historialmembresia.infrastructure.adapter.out.persistence.mapper.HistorialMembresiaPersistenceMapper;
import com.fitclub.historialmembresia.infrastructure.adapter.out.persistence.repository.SpringDataHistorialMembresiaRepository;
import com.fitclub.membresia.infrastructure.adapter.out.persistence.entity.MembresiaJpaEntity;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class HistorialMembresiaPersistenceAdapter
        implements HistorialMembresiaRepositoryPort {

    private final SpringDataHistorialMembresiaRepository repository;

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public HistorialMembresia guardar(HistorialMembresia historial) {

        var membresia = entityManager.getReference(
                MembresiaJpaEntity.class,
                historial.getMembresiaId()
        );

        var entity = HistorialMembresiaPersistenceMapper
                .toEntity(historial, membresia);

        return HistorialMembresiaPersistenceMapper
                .toDomain(repository.save(entity));
    }

    @Override
    public List<HistorialMembresia> listar() {
        return repository.findAll().stream()
                .map(HistorialMembresiaPersistenceMapper::toDomain)
                .toList();
    }

    @Override
    public Optional<HistorialMembresia> buscarPorId(Long id) {
        return repository.findById(id)
                .map(HistorialMembresiaPersistenceMapper::toDomain);
    }
}