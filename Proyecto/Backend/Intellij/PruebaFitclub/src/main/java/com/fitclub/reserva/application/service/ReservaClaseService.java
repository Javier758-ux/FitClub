package com.fitclub.reserva.application.service;

import com.fitclub.clase.application.port.in.ClaseUseCase;
import com.fitclub.clase.domain.exception.ClaseNoEncontradaException;
import com.fitclub.horario.application.port.in.HorarioUseCase;
import com.fitclub.horario.domain.exception.HorarioClaseNoEncontradoException;
import com.fitclub.membresia.application.port.in.MembresiaUseCase;
import com.fitclub.reserva.application.port.in.ReservaClaseUseCase;
import com.fitclub.reserva.application.port.out.ReservaClaseRepositoryPort;
import com.fitclub.reserva.domain.exception.CupoCompletoException;
import com.fitclub.reserva.domain.exception.HorarioNoDisponibleParaReservaException;
import com.fitclub.reserva.domain.exception.MembresiaNoVigenteException;
import com.fitclub.reserva.domain.exception.ReservaClaseNoEncontradaException;
import com.fitclub.reserva.domain.exception.ReservaDuplicadaException;
import com.fitclub.reserva.domain.exception.ReservaYaCanceladaException;
import com.fitclub.reserva.domain.model.EstadoReserva;
import com.fitclub.reserva.domain.model.ReservaClase;
import com.fitclub.shared.domain.exception.AccesoDenegadoException;
import com.fitclub.socio.application.port.in.SocioUseCase;
import com.fitclub.socio.domain.exception.SocioNoEncontradoException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ReservaClaseService implements ReservaClaseUseCase {
    private final ReservaClaseRepositoryPort repository;
    private final SocioUseCase socioUseCase;
    private final HorarioUseCase horarioUseCase;
    private final ClaseUseCase claseUseCase;
    private final MembresiaUseCase membresiaUseCase;

    @Value("${fitclub.reserva.limite-cancelacion-horas:2}")
    private long limiteCancelacionHoras;

    @Override
    @Transactional
    public ReservaClase registrar(ReservaClase reserva) {
        socioUseCase.buscarPorId(reserva.getSocioId())
                .orElseThrow(() -> new SocioNoEncontradoException(reserva.getSocioId()));

        var horario = horarioUseCase.buscarPorId(reserva.getHorarioClaseId())
                .orElseThrow(() -> new HorarioClaseNoEncontradoException(reserva.getHorarioClaseId()));

        LocalDateTime inicioClase = LocalDateTime.of(
                horario.getFecha(),
                horario.getHoraInicio()
        );

        if (!inicioClase.isAfter(LocalDateTime.now())) {
            throw new HorarioNoDisponibleParaReservaException();
        }

        if (!membresiaUseCase.tieneMembresiaVigente(reserva.getSocioId())) {
            throw new MembresiaNoVigenteException();
        }

        if (repository.existeReservaActiva(
                reserva.getSocioId(),
                reserva.getHorarioClaseId())) {
            throw new ReservaDuplicadaException();
        }

        var clase = claseUseCase.buscarPorId(horario.getClaseId())
                .orElseThrow(() ->
                        new ClaseNoEncontradaException(horario.getClaseId()));

        long ocupados = repository.contarReservasActivas(
                reserva.getHorarioClaseId()
        );

        if (ocupados >= clase.getCupoMaximo()) {
            throw new CupoCompletoException();
        }

        reserva.setId(null);
        reserva.setFechaReserva(LocalDateTime.now());
        reserva.setEstado(EstadoReserva.ACTIVA);
        reserva.setFechaCancelacion(null);
        reserva.setCancelacionTardia(false);

        return repository.guardar(reserva);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReservaClase> listar() {
        return repository.listar();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<ReservaClase> buscarPorId(Long id) {
        return repository.buscarPorId(id);
    }

    @Override
    @Transactional
    public ReservaClase cancelar(Long id) {
        var reserva = repository.buscarPorId(id)
                .orElseThrow(() ->
                        new ReservaClaseNoEncontradaException(id));

        if (reserva.getEstado() == EstadoReserva.CANCELADA) {
            throw new ReservaYaCanceladaException();
        }

        var horario = horarioUseCase.buscarPorId(reserva.getHorarioClaseId())
                .orElseThrow(() ->
                        new HorarioClaseNoEncontradoException(
                                reserva.getHorarioClaseId()
                        ));

        LocalDateTime ahora = LocalDateTime.now();
        LocalDateTime inicioClase = LocalDateTime.of(
                horario.getFecha(),
                horario.getHoraInicio()
        );

        boolean tardia = !ahora.isBefore(
                inicioClase.minusHours(limiteCancelacionHoras)
        );

        reserva.setEstado(EstadoReserva.CANCELADA);
        reserva.setFechaCancelacion(ahora);
        reserva.setCancelacionTardia(tardia);

        return repository.guardar(reserva);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReservaClase> listarPorSocio(Long socioId) {
        socioUseCase.buscarPorId(socioId)
                .orElseThrow(() -> new SocioNoEncontradoException(socioId));

        return repository.buscarPorSocioId(socioId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReservaClase> listarActivasPorHorario(Long horarioClaseId) {
        horarioUseCase.buscarPorId(horarioClaseId)
                .orElseThrow(() ->
                        new HorarioClaseNoEncontradoException(horarioClaseId));

        return repository.buscarActivasPorHorarioClaseId(horarioClaseId);
    }

    @Override
    @Transactional
    public ReservaClase cancelarPorSocio(Long id, Long socioId) {
        var reserva = repository.buscarPorId(id)
                .orElseThrow(() ->
                        new ReservaClaseNoEncontradaException(id));

        if (!reserva.getSocioId().equals(socioId)) {
            throw new AccesoDenegadoException(
                    "La reserva no pertenece al socio autenticado"
            );
        }

        return cancelar(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReservaClase> listarActivasPorHorarioDeInstructor(
            Long horarioClaseId,
            Long instructorId) {

        var horario = horarioUseCase.buscarPorId(horarioClaseId)
                .orElseThrow(() ->
                        new HorarioClaseNoEncontradoException(horarioClaseId));

        if (!horario.getInstructorId().equals(instructorId)) {
            throw new AccesoDenegadoException(
                    "El horario no pertenece al instructor autenticado"
            );
        }

        return repository.buscarActivasPorHorarioClaseId(horarioClaseId);
    }
}