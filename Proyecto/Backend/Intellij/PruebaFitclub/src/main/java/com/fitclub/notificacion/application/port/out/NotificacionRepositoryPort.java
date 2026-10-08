package com.fitclub.notificacion.application.port.out;

import com.fitclub.notificacion.domain.model.Notificacion;
import java.util.List;
import java.util.Optional;

public interface NotificacionRepositoryPort {
    Notificacion guardar(Notificacion notificacion);
    List<Notificacion> listar();
    Optional<Notificacion> buscarPorId(Long id);
    List<Notificacion> buscarPorSocioId(Long socioId);
}
