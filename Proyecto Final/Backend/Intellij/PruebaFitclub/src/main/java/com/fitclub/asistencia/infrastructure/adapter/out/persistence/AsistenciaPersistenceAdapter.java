package com.fitclub.asistencia.infrastructure.adapter.out.persistence;

import com.fitclub.asistencia.application.port.out.AsistenciaRepositoryPort;
import com.fitclub.asistencia.domain.model.Asistencia;
import com.fitclub.asistencia.infrastructure.adapter.out.persistence.mapper.AsistenciaPersistenceMapper;
import com.fitclub.asistencia.infrastructure.adapter.out.persistence.repository.SpringDataAsistenciaRepository;
import com.fitclub.reserva.infrastructure.adapter.out.persistence.entity.ReservaClaseJpaEntity;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class AsistenciaPersistenceAdapter implements AsistenciaRepositoryPort {

    private final SpringDataAsistenciaRepository repository;

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Asistencia guardar(Asistencia asistencia) {
        var reserva = entityManager.getReference(
                ReservaClaseJpaEntity.class,
                asistencia.getReservaClaseId()
        );

        var entity = AsistenciaPersistenceMapper.toEntity(asistencia, reserva);

        return AsistenciaPersistenceMapper.toDomain(repository.save(entity));
    }

    @Override
    public List<Asistencia> listar() {
        return repository.findAll().stream()
                .map(AsistenciaPersistenceMapper::toDomain)
                .toList();
    }

    @Override
    public Optional<Asistencia> buscarPorId(Long id) {
        return repository.findById(id)
                .map(AsistenciaPersistenceMapper::toDomain);
    }
    @Override
    public boolean existePorReservaClaseId(Long reservaClaseId) {
        return repository.existsByReservaClase_Id(reservaClaseId);
    }
}
