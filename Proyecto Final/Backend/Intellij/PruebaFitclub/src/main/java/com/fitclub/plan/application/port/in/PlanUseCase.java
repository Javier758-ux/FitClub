package com.fitclub.plan.application.port.in;

import com.fitclub.plan.domain.model.Plan;
import java.util.List;
import java.util.Optional;

public interface PlanUseCase {
    Plan registrar(Plan plan);
    Plan actualizar(Long id, Plan plan);
    List<Plan> listar();
    Optional<Plan> buscarPorId(Long id);
}
