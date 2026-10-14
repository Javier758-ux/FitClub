package com.fitclub.notificacion.application.port.in;

import com.fitclub.notificacion.domain.model.Notificacion;

import java.util.List;
import java.util.Optional;

public interface NotificacionUseCase {
    Notificacion registrar(Notificacion notificacion);
    List<Notificacion> listar();
    Optional<Notificacion> buscarPorId(Long id);
    Notificacion marcarComoLeida(Long id);
    List<Notificacion> listarPorSocio(Long socioId);
    Notificacion marcarComoLeidaPorSocio(Long id, Long socioId);
}
