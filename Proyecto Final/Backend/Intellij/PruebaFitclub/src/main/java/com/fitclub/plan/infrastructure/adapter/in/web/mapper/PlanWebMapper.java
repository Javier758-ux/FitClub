package com.fitclub.plan.infrastructure.adapter.in.web.mapper;

import com.fitclub.plan.domain.model.Plan;
import com.fitclub.plan.infrastructure.adapter.in.web.dto.PlanRequestDTO;
import com.fitclub.plan.infrastructure.adapter.in.web.dto.PlanResponseDTO;

public final class PlanWebMapper {
    private PlanWebMapper() {}
    public static Plan toDomain(PlanRequestDTO dto) {
        return new Plan(
                null,
                dto.getNombre(),
                dto.getDescripcion(),
                dto.getPrecio(),
                dto.getDuracionDias()
        );
    }

    public static PlanResponseDTO toResponseDTO(Plan plan) {
        return new PlanResponseDTO(
                plan.getId(),
                plan.getNombre(),
                plan.getDescripcion(),
                plan.getPrecio(),
                plan.getDuracionDias()
        );
    }
}