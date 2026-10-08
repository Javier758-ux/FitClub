package com.fitclub.plan.infrastructure.adapter.out.persistence.repository;

import com.fitclub.plan.infrastructure.adapter.out.persistence.entity.PlanJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SpringDataPlanRepository
        extends JpaRepository<PlanJpaEntity, Long> {
}
