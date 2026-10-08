package com.fitclub.plan.infrastructure.adapter.out.persistence;

import com.fitclub.plan.application.port.out.PlanRepositoryPort;
import com.fitclub.plan.domain.model.Plan;
import com.fitclub.plan.infrastructure.adapter.out.persistence.mapper.PlanPersistenceMapper;
import com.fitclub.plan.infrastructure.adapter.out.persistence.repository.SpringDataPlanRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class PlanPersistenceAdapter implements PlanRepositoryPort {

    private final SpringDataPlanRepository repository;

    @Override
    public Plan guardar(Plan plan) {
        return PlanPersistenceMapper.toDomain(
                repository.save(PlanPersistenceMapper.toEntity(plan))
        );
    }

    @Override
    public List<Plan> listar() {
        return repository.findAll().stream()
                .map(PlanPersistenceMapper::toDomain)
                .toList();
    }

    @Override
    public Optional<Plan> buscarPorId(Long id) {
        return repository.findById(id)
                .map(PlanPersistenceMapper::toDomain);
    }
}
