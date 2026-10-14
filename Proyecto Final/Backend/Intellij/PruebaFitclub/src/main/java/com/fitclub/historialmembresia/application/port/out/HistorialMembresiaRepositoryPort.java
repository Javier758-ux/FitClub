package com.fitclub.historialmembresia.application.port.out;

import com.fitclub.historialmembresia.domain.model.HistorialMembresia;
import java.util.List;
import java.util.Optional;

public interface HistorialMembresiaRepositoryPort {
    HistorialMembresia guardar(HistorialMembresia historial);
    List<HistorialMembresia> listar();
    Optional<HistorialMembresia> buscarPorId(Long id);
}
