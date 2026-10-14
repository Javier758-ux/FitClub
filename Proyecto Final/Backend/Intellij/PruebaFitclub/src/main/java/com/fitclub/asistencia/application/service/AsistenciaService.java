package com.fitclub.asistencia.application.service;

import com.fitclub.asistencia.application.port.in.AsistenciaUseCase;
import com.fitclub.asistencia.application.port.out.AsistenciaRepositoryPort;
import com.fitclub.asistencia.domain.exception.AsistenciaDuplicadaException;
import com.fitclub.asistencia.domain.exception.ReservaInvalidaException;
import com.fitclub.asistencia.domain.model.Asistencia;
import com.fitclub.horario.application.port.in.HorarioUseCase;
import com.fitclub.horario.domain.exception.HorarioClaseNoEncontradoException;
import com.fitclub.reserva.application.port.in.ReservaClaseUseCase;
import com.fitclub.reserva.domain.model.EstadoReserva;
import com.fitclub.shared.domain.exception.AccesoDenegadoException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AsistenciaService implements AsistenciaUseCase {
    private final AsistenciaRepositoryPort repository;
    private final ReservaClaseUseCase reservaUseCase;
    private final HorarioUseCase horarioUseCase;

    @Override
    @Transactional
    public Asistencia registrar(Asistencia asistencia) {
        var reserva = reservaUseCase.buscarPorId(asistencia.getReservaClaseId())
                .orElseThrow(() ->
                        new ReservaInvalidaException("La reserva no existe"));

        if (reserva.getEstado() != EstadoReserva.ACTIVA) {
            throw new ReservaInvalidaException(
                    "La reserva no está activa"
            );
        }

        if (repository.existePorReservaClaseId(
                asistencia.getReservaClaseId())) {
            throw new AsistenciaDuplicadaException();
        }

        asistencia.setId(null);
        asistencia.setFechaRegistro(LocalDateTime.now());

        return repository.guardar(asistencia);
    }

    @Override
    @Transactional
    public Asistencia registrarPorInstructor(
            Asistencia asistencia,
            Long instructorId) {

        var reserva = reservaUseCase.buscarPorId(
                        asistencia.getReservaClaseId())
                .orElseThrow(() ->
                        new ReservaInvalidaException(
                                "La reserva no existe"
                        ));

        var horario = horarioUseCase.buscarPorId(
                        reserva.getHorarioClaseId())
                .orElseThrow(() ->
                        new HorarioClaseNoEncontradoException(
                                reserva.getHorarioClaseId()
                        ));

        if (!horario.getInstructorId().equals(instructorId)) {
            throw new AccesoDenegadoException(
                    "La reserva no pertenece a una clase del instructor autenticado"
            );
        }

        return registrar(asistencia);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Asistencia> listar() {
        return repository.listar();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Asistencia> buscarPorId(Long id) {
        return repository.buscarPorId(id);
    }
}