package com.fitclub.socio.infrastructure.adapter.out.persistence.repository;

import com.fitclub.socio.infrastructure.adapter.out.persistence.entity.SocioJpaEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SpringDataSocioRepository extends JpaRepository<SocioJpaEntity, Long> {

    Optional<SocioJpaEntity> findByEmail(String email);

    Page<SocioJpaEntity> findByNombreContainingIgnoreCaseOrEmailContainingIgnoreCase(
            String nombre,
            String email,
            Pageable pageable
    );
}