package com.fitclub.plan.application.port.out;

import com.fitclub.plan.domain.model.Plan;
import java.util.List;
import java.util.Optional;

public interface PlanRepositoryPort {
    Plan guardar(Plan plan);
    List<Plan> listar();
    Optional<Plan> buscarPorId(Long id);
}
