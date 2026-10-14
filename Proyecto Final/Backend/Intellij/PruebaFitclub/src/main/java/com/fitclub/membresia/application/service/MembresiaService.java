package com.fitclub.membresia.application.service;

import com.fitclub.auth.application.port.in.UsuarioActualUseCase;
import com.fitclub.historialmembresia.application.port.in.HistorialMembresiaUseCase;
import com.fitclub.historialmembresia.domain.model.HistorialMembresia;
import com.fitclub.membresia.application.port.in.MembresiaUseCase;
import com.fitclub.membresia.application.port.out.MembresiaRepositoryPort;
import com.fitclub.membresia.domain.exception.CambioEstadoMembresiaInvalidoException;
import com.fitclub.membresia.domain.exception.MembresiaNoEncontradaException;
import com.fitclub.membresia.domain.model.EstadoMembresia;
import com.fitclub.membresia.domain.model.Membresia;
import com.fitclub.plan.application.port.in.PlanUseCase;
import com.fitclub.plan.domain.exception.PlanNoEncontradoException;
import com.fitclub.socio.application.port.in.SocioUseCase;
import com.fitclub.socio.domain.exception.SocioNoEncontradoException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class MembresiaService implements MembresiaUseCase {
    private final MembresiaRepositoryPort repository;
    private final SocioUseCase socioUseCase;
    private final PlanUseCase planUseCase;
    private final HistorialMembresiaUseCase historialUseCase;
    private final UsuarioActualUseCase usuarioActualUseCase;

    @Override
    @Transactional
    public Membresia registrar(Membresia membresia) {
        socioUseCase.buscarPorId(membresia.getSocioId())
                .orElseThrow(() ->
                        new SocioNoEncontradoException(
                                membresia.getSocioId()
                        ));

        var plan = planUseCase.buscarPorId(membresia.getPlanId())
                .orElseThrow(() ->
                        new PlanNoEncontradoException(
                                membresia.getPlanId()
                        ));

        membresia.setId(null);
        membresia.setFechaFin(
                membresia.getFechaInicio()
                        .plusDays(plan.getDuracionDias())
        );
        membresia.setEstado(EstadoMembresia.ACTIVA);

        Membresia guardada = repository.guardar(membresia);

        registrarHistorial(
                guardada,
                null,
                "Membresía creada",
                usuarioActualUseCase.obtener().getEmail()
        );

        return guardada;
    }

    @Override
    @Transactional
    public List<Membresia> listar() {
        actualizarVencidas();
        return repository.listar();
    }

    @Override
    @Transactional
    public Optional<Membresia> buscarPorId(Long id) {
        actualizarVencidas();
        return repository.buscarPorId(id);
    }

    @Override
    @Transactional
    public boolean tieneMembresiaVigente(Long socioId) {
        actualizarVencidas();
        return repository.existeVigentePorSocio(socioId);
    }

    @Override
    @Transactional
    public Membresia suspender(Long id) {
        actualizarVencidas();

        var membresia = repository.buscarPorId(id)
                .orElseThrow(() ->
                        new MembresiaNoEncontradaException(id));

        if (membresia.getEstado() != EstadoMembresia.ACTIVA) {
            throw new CambioEstadoMembresiaInvalidoException(
                    "Solo una membresía ACTIVA puede suspenderse"
            );
        }

        EstadoMembresia estadoAnterior = membresia.getEstado();
        membresia.setEstado(EstadoMembresia.SUSPENDIDA);

        Membresia guardada = repository.guardar(membresia);

        registrarHistorial(
                guardada,
                estadoAnterior,
                "Membresía suspendida",
                usuarioActualUseCase.obtener().getEmail()
        );

        return guardada;
    }

    @Override
    @Transactional
    public Membresia cancelar(Long id) {
        actualizarVencidas();

        var membresia = repository.buscarPorId(id)
                .orElseThrow(() ->
                        new MembresiaNoEncontradaException(id));

        if (membresia.getEstado() == EstadoMembresia.CANCELADA) {
            throw new CambioEstadoMembresiaInvalidoException(
                    "La membresía ya se encuentra cancelada"
            );
        }

        if (membresia.getEstado() == EstadoMembresia.VENCIDA) {
            throw new CambioEstadoMembresiaInvalidoException(
                    "Una membresía vencida no puede cancelarse"
            );
        }

        EstadoMembresia estadoAnterior = membresia.getEstado();
        membresia.setEstado(EstadoMembresia.CANCELADA);

        Membresia guardada = repository.guardar(membresia);

        registrarHistorial(
                guardada,
                estadoAnterior,
                "Membresía cancelada",
                usuarioActualUseCase.obtener().getEmail()
        );

        return guardada;
    }

    @Override
    @Transactional
    public Membresia reactivar(Long id) {
        actualizarVencidas();

        var membresia = repository.buscarPorId(id)
                .orElseThrow(() ->
                        new MembresiaNoEncontradaException(id));

        if (membresia.getEstado() != EstadoMembresia.SUSPENDIDA) {
            throw new CambioEstadoMembresiaInvalidoException(
                    "Solo una membresía SUSPENDIDA puede reactivarse"
            );
        }

        EstadoMembresia estadoAnterior = membresia.getEstado();
        membresia.setEstado(EstadoMembresia.ACTIVA);

        Membresia guardada = repository.guardar(membresia);

        registrarHistorial(
                guardada,
                estadoAnterior,
                "Membresía reactivada",
                usuarioActualUseCase.obtener().getEmail()
        );

        return guardada;
    }

    private void actualizarVencidas() {
        var vencidas = repository.buscarVencidasPendientes(
                LocalDate.now()
        );

        for (Membresia membresia : vencidas) {
            EstadoMembresia estadoAnterior =
                    membresia.getEstado();

            membresia.setEstado(EstadoMembresia.VENCIDA);

            Membresia guardada =
                    repository.guardar(membresia);

            registrarHistorial(
                    guardada,
                    estadoAnterior,
                    "Membresía vencida",
                    "SISTEMA"
            );
        }
    }

    private void registrarHistorial(
            Membresia membresia,
            EstadoMembresia estadoAnterior,
            String motivo,
            String usuarioEmail) {

        HistorialMembresia historial =
                new HistorialMembresia(
                        null,
                        membresia.getId(),
                        estadoAnterior,
                        membresia.getEstado(),
                        null,
                        motivo,
                        usuarioEmail
                );

        historialUseCase.registrar(historial);
    }

    @Override
    @Transactional
    public List<Membresia> filtrar(
            Long socioId,
            EstadoMembresia estado) {

        actualizarVencidas();

        if (socioId != null) {
            socioUseCase.buscarPorId(socioId)
                    .orElseThrow(() ->
                            new SocioNoEncontradoException(
                                    socioId
                            ));
        }

        if (socioId != null && estado != null) {
            return repository.buscarPorSocioIdYEstado(
                    socioId,
                    estado
            );
        }

        if (socioId != null) {
            return repository.buscarPorSocioId(socioId);
        }

        if (estado != null) {
            return repository.buscarPorEstado(estado);
        }

        return repository.listar();
    }
}