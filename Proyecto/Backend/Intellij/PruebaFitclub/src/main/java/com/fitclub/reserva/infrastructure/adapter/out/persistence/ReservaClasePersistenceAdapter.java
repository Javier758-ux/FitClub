package com.fitclub.reserva.infrastructure.adapter.out.persistence;

import com.fitclub.horario.infrastructure.adapter.out.persistence.entity.HorarioClaseJpaEntity;
import com.fitclub.reserva.application.port.out.ReservaClaseRepositoryPort;
import com.fitclub.reserva.domain.model.EstadoReserva;
import com.fitclub.reserva.domain.model.ReservaClase;
import com.fitclub.reserva.infrastructure.adapter.out.persistence.mapper.ReservaClasePersistenceMapper;
import com.fitclub.reserva.infrastructure.adapter.out.persistence.repository.SpringDataReservaClaseRepository;
import com.fitclub.socio.infrastructure.adapter.out.persistence.entity.SocioJpaEntity;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class ReservaClasePersistenceAdapter implements ReservaClaseRepositoryPort {
    private final SpringDataReservaClaseRepository repository;

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public ReservaClase guardar(ReservaClase reserva) {

        var socio = entityManager.getReference(
                SocioJpaEntity.class,
                reserva.getSocioId()
        );

        var horario = entityManager.getReference(
                HorarioClaseJpaEntity.class,
                reserva.getHorarioClaseId()
        );

        var entity = ReservaClasePersistenceMapper.toEntity(
                reserva,
                socio,
                horario
        );

        return ReservaClasePersistenceMapper.toDomain(
                repository.save(entity)
        );
    }

    @Override
    public List<ReservaClase> listar() {
        return repository.findAll().stream()
                .map(ReservaClasePersistenceMapper::toDomain)
                .toList();
    }

    @Override
    public Optional<ReservaClase> buscarPorId(Long id) {
        return repository.findById(id)
                .map(ReservaClasePersistenceMapper::toDomain);
    }

    @Override
    public boolean existeReservaActiva(
            Long socioId,
            Long horarioClaseId) {

        return repository
                .existsBySocio_IdAndHorarioClase_IdAndEstado(
                        socioId,
                        horarioClaseId,
                        EstadoReserva.ACTIVA
                );
    }

    @Override
    public long contarReservasActivas(Long horarioClaseId) {

        return repository.countByHorarioClase_IdAndEstado(
                horarioClaseId,
                EstadoReserva.ACTIVA
        );
    }

    @Override
    public List<ReservaClase> buscarPorSocioId(Long socioId) {
        return repository.findBySocio_IdOrderByFechaReservaDesc(socioId).stream()
                .map(ReservaClasePersistenceMapper::toDomain)
                .toList();
    }

    @Override
    public List<ReservaClase> buscarActivasPorHorarioClaseId(Long horarioClaseId) {
        return repository.findByHorarioClase_IdAndEstado(horarioClaseId, EstadoReserva.ACTIVA).stream()
                .map(ReservaClasePersistenceMapper::toDomain)
                .toList();
    }
}