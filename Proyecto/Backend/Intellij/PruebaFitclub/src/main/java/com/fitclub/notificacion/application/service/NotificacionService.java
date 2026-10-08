package com.fitclub.notificacion.application.service;

import com.fitclub.notificacion.application.port.in.NotificacionUseCase;
import com.fitclub.notificacion.application.port.out.NotificacionRepositoryPort;
import com.fitclub.notificacion.domain.model.Notificacion;
import com.fitclub.socio.application.port.in.SocioUseCase;
import com.fitclub.socio.domain.exception.SocioNoEncontradoException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.fitclub.notificacion.domain.exception.NotificacionNoEncontradaException;
import com.fitclub.shared.domain.exception.AccesoDenegadoException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class NotificacionService implements NotificacionUseCase {
    private final NotificacionRepositoryPort repository;
    private final SocioUseCase socioUseCase;

    @Override
    @Transactional
    public Notificacion registrar(Notificacion notificacion) {

        socioUseCase.buscarPorId(notificacion.getSocioId())
                .orElseThrow(() ->
                        new SocioNoEncontradoException(
                                notificacion.getSocioId()
                        ));

        notificacion.setId(null);
        notificacion.setFechaEnvio(LocalDateTime.now());
        notificacion.setLeida(false);

        return repository.guardar(notificacion);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Notificacion> listar() {
        return repository.listar();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Notificacion> buscarPorId(Long id) {
        return repository.buscarPorId(id);
    }

    @Override
    @Transactional
    public Notificacion marcarComoLeida(Long id) {
        var notificacion = repository.buscarPorId(id)
                .orElseThrow(() -> new NotificacionNoEncontradaException(id));

        notificacion.setLeida(true);
        return repository.guardar(notificacion);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Notificacion> listarPorSocio(Long socioId) {
        socioUseCase.buscarPorId(socioId)
                .orElseThrow(() -> new SocioNoEncontradoException(socioId));

        return repository.buscarPorSocioId(socioId);
    }

    @Override
    @Transactional
    public Notificacion marcarComoLeidaPorSocio(Long id, Long socioId) {
        var notificacion = repository.buscarPorId(id)
                .orElseThrow(() -> new NotificacionNoEncontradaException(id));

        if (!notificacion.getSocioId().equals(socioId)) {
            throw new AccesoDenegadoException(
                    "La notificación no pertenece al socio autenticado"
            );
        }

        notificacion.setLeida(true);
        return repository.guardar(notificacion);
    }
}