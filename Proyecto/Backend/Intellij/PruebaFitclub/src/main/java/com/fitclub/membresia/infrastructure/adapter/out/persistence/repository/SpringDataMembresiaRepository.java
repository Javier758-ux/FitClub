package com.fitclub.membresia.infrastructure.adapter.out.persistence.repository;

import com.fitclub.membresia.infrastructure.adapter.out.persistence.entity.MembresiaJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import com.fitclub.membresia.domain.model.EstadoMembresia;
import java.time.LocalDate;

import java.util.List;

public interface SpringDataMembresiaRepository extends JpaRepository<MembresiaJpaEntity, Long> {
    List<MembresiaJpaEntity> findBySocio_Id(Long socioId);
    boolean existsBySocio_IdAndEstadoAndFechaInicioLessThanEqualAndFechaFinGreaterThanEqual(
            Long socioId,
            EstadoMembresia estado,
            LocalDate fechaInicio,
            LocalDate fechaFin
    );
    List<MembresiaJpaEntity> findByEstadoInAndFechaFinBefore(List<EstadoMembresia> estados, LocalDate fecha);

    List<MembresiaJpaEntity> findByEstado(EstadoMembresia estado);

    List<MembresiaJpaEntity> findBySocio_IdAndEstado(
            Long socioId,
            EstadoMembresia estado
    );
}