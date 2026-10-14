package com.fitclub.horario.application.service;

import com.fitclub.clase.application.port.in.ClaseUseCase;
import com.fitclub.clase.domain.exception.ClaseNoEncontradaException;
import com.fitclub.horario.application.port.in.HorarioUseCase;
import com.fitclub.horario.application.port.out.HorarioClaseRepositoryPort;
import com.fitclub.horario.domain.exception.HorarioClaseNoEncontradoException;
import com.fitclub.horario.domain.exception.HorarioInvalidoException;
import com.fitclub.horario.domain.exception.InstructorHorarioSolapadoException;
import com.fitclub.horario.domain.model.HorarioClase;
import com.fitclub.instructor.application.port.in.InstructorUseCase;
import com.fitclub.instructor.domain.exception.InstructorNoEncontradoException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class HorarioClaseService implements HorarioUseCase {
    private final HorarioClaseRepositoryPort repository;
    private final ClaseUseCase claseUseCase;
    private final InstructorUseCase instructorUseCase;

    @Override
    @Transactional
    public HorarioClase registrar(HorarioClase horario) {
        claseUseCase.buscarPorId(horario.getClaseId())
                .orElseThrow(() -> new ClaseNoEncontradaException(horario.getClaseId()));

        instructorUseCase.buscarPorId(horario.getInstructorId())
                .orElseThrow(() -> new InstructorNoEncontradoException(horario.getInstructorId()));

        validarHorario(horario);

        if (repository.existeSolapamiento(
                horario.getInstructorId(),
                horario.getFecha(),
                horario.getHoraInicio(),
                horario.getHoraFin())) {
            throw new InstructorHorarioSolapadoException();
        }

        horario.setId(null);
        return repository.guardar(horario);
    }

    @Override
    @Transactional
    public HorarioClase actualizar(Long id, HorarioClase horario) {
        var existente = repository.buscarPorId(id)
                .orElseThrow(() -> new HorarioClaseNoEncontradoException(id));

        claseUseCase.buscarPorId(horario.getClaseId())
                .orElseThrow(() -> new ClaseNoEncontradaException(horario.getClaseId()));

        instructorUseCase.buscarPorId(horario.getInstructorId())
                .orElseThrow(() -> new InstructorNoEncontradoException(horario.getInstructorId()));

        validarHorario(horario);

        if (repository.existeSolapamientoExcluyendoId(
                id,
                horario.getInstructorId(),
                horario.getFecha(),
                horario.getHoraInicio(),
                horario.getHoraFin())) {
            throw new InstructorHorarioSolapadoException();
        }

        existente.setClaseId(horario.getClaseId());
        existente.setInstructorId(horario.getInstructorId());
        existente.setFecha(horario.getFecha());
        existente.setHoraInicio(horario.getHoraInicio());
        existente.setHoraFin(horario.getHoraFin());

        return repository.guardar(existente);
    }

    @Override
    @Transactional(readOnly = true)
    public List<HorarioClase> listar() {
        return repository.listar();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<HorarioClase> buscarPorId(Long id) {
        return repository.buscarPorId(id);
    }

    private void validarHorario(HorarioClase horario) {
        if (!horario.getHoraInicio().isBefore(horario.getHoraFin())) {
            throw new HorarioInvalidoException();
        }

        LocalDateTime inicio = LocalDateTime.of(horario.getFecha(), horario.getHoraInicio());

        if (!inicio.isAfter(LocalDateTime.now())) {
            throw new HorarioInvalidoException("No se puede crear o actualizar un horario en una fecha u hora pasada");
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<HorarioClase> listarPorInstructorYFecha(Long instructorId, LocalDate fecha) {
        instructorUseCase.buscarPorId(instructorId)
                .orElseThrow(() -> new InstructorNoEncontradoException(instructorId));

        return repository.buscarPorInstructorYFecha(instructorId, fecha);
    }
}