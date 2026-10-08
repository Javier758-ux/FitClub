package com.fitclub.membresia.application.port.out;

import com.fitclub.membresia.domain.model.Membresia;
import com.fitclub.membresia.domain.model.EstadoMembresia;

import java.util.List;
import java.util.Optional;
import java.time.LocalDate;

public interface MembresiaRepositoryPort {
    Membresia guardar(Membresia membresia);
    List<Membresia> listar();
    Optional<Membresia> buscarPorId(Long id);
    boolean existeVigentePorSocio(Long socioId);
    List<Membresia> buscarVencidasPendientes(LocalDate fecha);
    List<Membresia> buscarPorSocioId(Long socioId);
    List<Membresia> buscarPorEstado(EstadoMembresia estado);
    List<Membresia> buscarPorSocioIdYEstado(Long socioId, EstadoMembresia estado);
}