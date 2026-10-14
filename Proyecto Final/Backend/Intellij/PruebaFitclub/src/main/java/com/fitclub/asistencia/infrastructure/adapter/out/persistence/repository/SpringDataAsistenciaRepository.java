package com.fitclub.asistencia.infrastructure.adapter.out.persistence.repository;

import com.fitclub.asistencia.infrastructure.adapter.out.persistence.entity.AsistenciaJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SpringDataAsistenciaRepository extends JpaRepository<AsistenciaJpaEntity, Long> {
    boolean existsByReservaClase_Id(Long reservaClaseId);
}