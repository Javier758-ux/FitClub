package com.fitclub.clase.infrastructure.adapter.out.persistence.repository;

import com.fitclub.clase.infrastructure.adapter.out.persistence.entity.ClaseJpaEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SpringDataClaseRepository extends JpaRepository<ClaseJpaEntity, Long> {
    Page<ClaseJpaEntity> findByNombreContainingIgnoreCaseOrDescripcionContainingIgnoreCase(
            String nombre,
            String descripcion,
            Pageable pageable
    );
}