package com.fitclub.plan.application.service;

import com.fitclub.plan.application.port.in.PlanUseCase;
import com.fitclub.plan.application.port.out.PlanRepositoryPort;
import com.fitclub.plan.domain.exception.PlanNoEncontradoException;
import com.fitclub.plan.domain.model.Plan;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PlanService implements PlanUseCase {
    private final PlanRepositoryPort repository;

    @Override
    @Transactional
    public Plan registrar(Plan plan) {
        plan.setId(null);
        return repository.guardar(plan);
    }

    @Override
    @Transactional
    public Plan actualizar(Long id, Plan plan) {
        var existente = repository.buscarPorId(id)
                .orElseThrow(() -> new PlanNoEncontradoException(id));

        existente.setNombre(plan.getNombre());
        existente.setDescripcion(plan.getDescripcion());
        existente.setPrecio(plan.getPrecio());
        existente.setDuracionDias(plan.getDuracionDias());

        return repository.guardar(existente);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Plan> listar() {
        return repository.listar();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Plan> buscarPorId(Long id) {
        return repository.buscarPorId(id);
    }
}