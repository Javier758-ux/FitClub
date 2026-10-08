package com.fitclub.instructor.infrastructure.adapter.out.persistence.repository;

import com.fitclub.instructor.infrastructure.adapter.out.persistence.entity.InstructorJpaEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SpringDataInstructorRepository extends JpaRepository<InstructorJpaEntity, Long> {
    Page<InstructorJpaEntity> findByNombreContainingIgnoreCaseOrEmailContainingIgnoreCaseOrEspecialidadContainingIgnoreCase(
            String nombre,
            String email,
            String especialidad,
            Pageable pageable
    );
}