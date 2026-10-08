package com.fitclub.reserva.infrastructure.adapter.out.persistence.mapper;

import com.fitclub.horario.infrastructure.adapter.out.persistence.entity.HorarioClaseJpaEntity;
import com.fitclub.reserva.domain.model.ReservaClase;
import com.fitclub.reserva.infrastructure.adapter.out.persistence.entity.ReservaClaseJpaEntity;
import com.fitclub.socio.infrastructure.adapter.out.persistence.entity.SocioJpaEntity;

public final class ReservaClasePersistenceMapper {
    private ReservaClasePersistenceMapper() {}

    public static ReservaClaseJpaEntity toEntity(ReservaClase reserva, SocioJpaEntity socio, HorarioClaseJpaEntity horario) {
        return new ReservaClaseJpaEntity(
                reserva.getId(),
                socio,
                horario,
                reserva.getFechaReserva(),
                reserva.getEstado(),
                reserva.getFechaCancelacion(),
                reserva.getCancelacionTardia()
        );
    }

    public static ReservaClase toDomain(ReservaClaseJpaEntity entity) {
        return new ReservaClase(
                entity.getId(),
                entity.getSocio().getId(),
                entity.getHorarioClase().getId(),
                entity.getFechaReserva(),
                entity.getEstado(),
                entity.getFechaCancelacion(),
                entity.getCancelacionTardia()
        );
    }
}