package com.fitclub.historialmembresia.infrastructure.adapter.out.persistence.repository;

import com.fitclub.historialmembresia.infrastructure.adapter.out.persistence.entity.HistorialMembresiaJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SpringDataHistorialMembresiaRepository
        extends JpaRepository<HistorialMembresiaJpaEntity, Long> {
}