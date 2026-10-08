package com.fitclub.membresia.application.port.in;

import com.fitclub.membresia.domain.model.Membresia;
import com.fitclub.membresia.domain.model.EstadoMembresia;

import java.util.List;
import java.util.Optional;

public interface MembresiaUseCase {
    Membresia registrar(Membresia membresia);
    Membresia suspender(Long id);
    Membresia cancelar(Long id);
    Membresia reactivar(Long id);
    List<Membresia> listar();
    Optional<Membresia> buscarPorId(Long id);
    boolean tieneMembresiaVigente(Long socioId);
    List<Membresia> filtrar(Long socioId, EstadoMembresia estado);
}