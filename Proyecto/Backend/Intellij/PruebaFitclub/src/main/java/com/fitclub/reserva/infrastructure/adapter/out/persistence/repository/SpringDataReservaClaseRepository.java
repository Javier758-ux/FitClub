package com.fitclub.reserva.infrastructure.adapter.out.persistence.repository;

import com.fitclub.reserva.domain.model.EstadoReserva;
import com.fitclub.reserva.infrastructure.adapter.out.persistence.entity.ReservaClaseJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SpringDataReservaClaseRepository extends JpaRepository<ReservaClaseJpaEntity, Long> {
    boolean existsBySocio_IdAndHorarioClase_IdAndEstado(Long socioId, Long horarioClaseId, EstadoReserva estado);
    long countByHorarioClase_IdAndEstado(Long horarioClaseId, EstadoReserva estado);
    List<ReservaClaseJpaEntity> findBySocio_IdOrderByFechaReservaDesc(Long socioId);
    List<ReservaClaseJpaEntity> findByHorarioClase_IdAndEstado(Long horarioClaseId, EstadoReserva estado);
}