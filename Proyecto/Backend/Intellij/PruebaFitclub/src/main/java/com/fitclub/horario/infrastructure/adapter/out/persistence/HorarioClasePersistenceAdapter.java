package com.fitclub.horario.infrastructure.adapter.out.persistence;

import com.fitclub.clase.infrastructure.adapter.out.persistence.entity.ClaseJpaEntity;
import com.fitclub.horario.application.port.out.HorarioClaseRepositoryPort;
import com.fitclub.horario.domain.model.HorarioClase;
import com.fitclub.horario.infrastructure.adapter.out.persistence.mapper.HorarioClasePersistenceMapper;
import com.fitclub.horario.infrastructure.adapter.out.persistence.repository.SpringDataHorarioClaseRepository;
import com.fitclub.instructor.infrastructure.adapter.out.persistence.entity.InstructorJpaEntity;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class HorarioClasePersistenceAdapter implements HorarioClaseRepositoryPort {
    private final SpringDataHorarioClaseRepository repository;

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public HorarioClase guardar(HorarioClase horario) {

        var clase = entityManager.getReference(
                ClaseJpaEntity.class,
                horario.getClaseId()
        );

        var instructor = entityManager.getReference(
                InstructorJpaEntity.class,
                horario.getInstructorId()
        );

        var entity = HorarioClasePersistenceMapper.toEntity(
                horario,
                clase,
                instructor
        );

        return HorarioClasePersistenceMapper.toDomain(
                repository.save(entity)
        );
    }

    @Override
    public List<HorarioClase> listar() {
        return repository.findAll().stream()
                .map(HorarioClasePersistenceMapper::toDomain)
                .toList();
    }

    @Override
    public Optional<HorarioClase> buscarPorId(Long id) {
        return repository.findById(id)
                .map(HorarioClasePersistenceMapper::toDomain);
    }

    @Override
    public boolean existeSolapamiento(
            Long instructorId,
            LocalDate fecha,
            LocalTime horaInicio,
            LocalTime horaFin) {

        return repository
                .existsByInstructor_IdAndFechaAndHoraInicioLessThanAndHoraFinGreaterThan(
                        instructorId,
                        fecha,
                        horaFin,
                        horaInicio
                );
    }

    @Override
    public boolean existeSolapamientoExcluyendoId(Long id, Long instructorId, LocalDate fecha, LocalTime horaInicio, LocalTime horaFin) {
        return repository.existsByIdNotAndInstructor_IdAndFechaAndHoraInicioLessThanAndHoraFinGreaterThan(
                id,
                instructorId,
                fecha,
                horaFin,
                horaInicio
        );
    }

    @Override
    public List<HorarioClase> buscarPorInstructorYFecha(Long instructorId, LocalDate fecha) {
        return repository.findByInstructor_IdAndFechaOrderByHoraInicioAsc(instructorId, fecha).stream()
                .map(HorarioClasePersistenceMapper::toDomain)
                .toList();
    }
}