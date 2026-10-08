package com.fitclub.notificacion.infrastructure.adapter.out.persistence;

import com.fitclub.notificacion.application.port.out.NotificacionRepositoryPort;
import com.fitclub.notificacion.domain.model.Notificacion;
import com.fitclub.notificacion.infrastructure.adapter.out.persistence.mapper.NotificacionPersistenceMapper;
import com.fitclub.notificacion.infrastructure.adapter.out.persistence.repository.SpringDataNotificacionRepository;
import com.fitclub.socio.infrastructure.adapter.out.persistence.entity.SocioJpaEntity;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class NotificacionPersistenceAdapter implements NotificacionRepositoryPort {
    private final SpringDataNotificacionRepository repository;

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Notificacion guardar(Notificacion notificacion) {

        var socio = entityManager.getReference(
                SocioJpaEntity.class,
                notificacion.getSocioId()
        );

        var entity = NotificacionPersistenceMapper.toEntity(
                notificacion,
                socio
        );

        return NotificacionPersistenceMapper.toDomain(
                repository.save(entity)
        );
    }

    @Override
    public List<Notificacion> listar() {
        return repository.findAll().stream()
                .map(NotificacionPersistenceMapper::toDomain)
                .toList();
    }

    @Override
    public Optional<Notificacion> buscarPorId(Long id) {
        return repository.findById(id)
                .map(NotificacionPersistenceMapper::toDomain);
    }

    @Override
    public List<Notificacion> buscarPorSocioId(Long socioId) {
        return repository.findBySocio_IdOrderByFechaEnvioDesc(socioId).stream()
                .map(NotificacionPersistenceMapper::toDomain)
                .toList();
    }
}