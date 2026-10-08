package com.fitclub.notificacion.infrastructure.adapter.out.persistence.repository;

import com.fitclub.notificacion.infrastructure.adapter.out.persistence.entity.NotificacionJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SpringDataNotificacionRepository extends JpaRepository<NotificacionJpaEntity, Long> {
    List<NotificacionJpaEntity> findBySocio_IdOrderByFechaEnvioDesc(Long socioId);
}