package com.fitclub.reserva.infrastructure.adapter.out.persistence.entity;

import com.fitclub.horario.infrastructure.adapter.out.persistence.entity.HorarioClaseJpaEntity;
import com.fitclub.reserva.domain.model.EstadoReserva;
import com.fitclub.socio.infrastructure.adapter.out.persistence.entity.SocioJpaEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "reserva_clase", schema = "fitclub")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class ReservaClaseJpaEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "socio_id", nullable = false)
    private SocioJpaEntity socio;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "horario_clase_id", nullable = false)
    private HorarioClaseJpaEntity horarioClase;

    @Column(name = "fecha_reserva", nullable = false)
    private LocalDateTime fechaReserva;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoReserva estado;

    @Column(name = "fecha_cancelacion")
    private LocalDateTime fechaCancelacion;

    @Column(name = "cancelacion_tardia", nullable = false)
    private Boolean cancelacionTardia;
}