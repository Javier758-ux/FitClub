package com.fitclub.membresia.infrastructure.adapter.out.persistence;

import com.fitclub.membresia.application.port.out.MembresiaRepositoryPort;
import com.fitclub.membresia.domain.model.Membresia;
import com.fitclub.membresia.infrastructure.adapter.out.persistence.mapper.MembresiaPersistenceMapper;
import com.fitclub.membresia.infrastructure.adapter.out.persistence.repository.SpringDataMembresiaRepository;
import com.fitclub.plan.infrastructure.adapter.out.persistence.entity.PlanJpaEntity;
import com.fitclub.socio.infrastructure.adapter.out.persistence.entity.SocioJpaEntity;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import com.fitclub.membresia.domain.model.EstadoMembresia;
import java.time.LocalDate;

import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class MembresiaPersistenceAdapter implements MembresiaRepositoryPort {
    private final SpringDataMembresiaRepository repository;

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Membresia guardar(Membresia membresia) {

        var socio = entityManager.getReference(
                SocioJpaEntity.class,
                membresia.getSocioId()
        );

        var plan = entityManager.getReference(
                PlanJpaEntity.class,
                membresia.getPlanId()
        );

        var entity = MembresiaPersistenceMapper.toEntity(
                membresia,
                socio,
                plan
        );

        return MembresiaPersistenceMapper.toDomain(
                repository.save(entity)
        );
    }

    @Override
    public List<Membresia> listar() {
        return repository.findAll().stream()
                .map(MembresiaPersistenceMapper::toDomain)
                .toList();
    }

    @Override
    public Optional<Membresia> buscarPorId(Long id) {
        return repository.findById(id)
                .map(MembresiaPersistenceMapper::toDomain);
    }
    @Override
    public boolean existeVigentePorSocio(Long socioId) {
        LocalDate hoy = LocalDate.now();
        return repository
                .existsBySocio_IdAndEstadoAndFechaInicioLessThanEqualAndFechaFinGreaterThanEqual(
                        socioId,
                        EstadoMembresia.ACTIVA,
                        hoy,
                        hoy
                );
    }

    @Override
    public List<Membresia> buscarVencidasPendientes(LocalDate fecha) {
        return repository.findByEstadoInAndFechaFinBefore(
                        List.of(EstadoMembresia.ACTIVA, EstadoMembresia.SUSPENDIDA),
                        fecha
                ).stream()
                .map(MembresiaPersistenceMapper::toDomain)
                .toList();
    }

    @Override
    public List<Membresia> buscarPorSocioId(Long socioId) {
        return repository.findBySocio_Id(socioId).stream()
                .map(MembresiaPersistenceMapper::toDomain)
                .toList();
    }

    @Override
    public List<Membresia> buscarPorEstado(EstadoMembresia estado) {
        return repository.findByEstado(estado).stream()
                .map(MembresiaPersistenceMapper::toDomain)
                .toList();
    }

    @Override
    public List<Membresia> buscarPorSocioIdYEstado(Long socioId, EstadoMembresia estado) {
        return repository.findBySocio_IdAndEstado(socioId, estado).stream()
                .map(MembresiaPersistenceMapper::toDomain)
                .toList();
    }
}