package com.fitclub.historialmembresia.application.port.in;

import com.fitclub.historialmembresia.domain.model.HistorialMembresia;
import java.util.List;
import java.util.Optional;

public interface HistorialMembresiaUseCase {
    HistorialMembresia registrar(HistorialMembresia historial);
    List<HistorialMembresia> listar();
    Optional<HistorialMembresia> buscarPorId(Long id);
}
