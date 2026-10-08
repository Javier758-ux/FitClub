package com.fitclub.auth.infrastructure.adapter.out.persistence.repository;

import com.fitclub.auth.infrastructure.adapter.out.persistence.entity.UsuarioJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SpringDataUsuarioRepository extends JpaRepository<UsuarioJpaEntity, Long> {
    Optional<UsuarioJpaEntity> findByEmailIgnoreCase(String email);
    boolean existsBySocioId(Long socioId);
    boolean existsByInstructorId(Long instructorId);
}