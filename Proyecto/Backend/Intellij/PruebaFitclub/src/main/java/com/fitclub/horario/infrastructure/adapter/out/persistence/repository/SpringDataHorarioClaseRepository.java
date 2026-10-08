package com.fitclub.horario.infrastructure.adapter.out.persistence.repository;

import com.fitclub.horario.infrastructure.adapter.out.persistence.entity.HorarioClaseJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface SpringDataHorarioClaseRepository extends JpaRepository<HorarioClaseJpaEntity, Long> {

    boolean existsByInstructor_IdAndFechaAndHoraInicioLessThanAndHoraFinGreaterThan(
            Long instructorId,
            LocalDate fecha,
            LocalTime horaFin,
            LocalTime horaInicio
    );
    boolean existsByIdNotAndInstructor_IdAndFechaAndHoraInicioLessThanAndHoraFinGreaterThan(
            Long id,
            Long instructorId,
            LocalDate fecha,
            LocalTime horaFin,
            LocalTime horaInicio
    );
    List<HorarioClaseJpaEntity> findByInstructor_IdAndFechaOrderByHoraInicioAsc(Long instructorId, LocalDate fecha);
}