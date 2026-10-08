package com.fitclub.membresia.infrastructure.adapter.out.persistence.entity;

import com.fitclub.membresia.domain.model.EstadoMembresia;
import com.fitclub.plan.infrastructure.adapter.out.persistence.entity.PlanJpaEntity;
import com.fitclub.socio.infrastructure.adapter.out.persistence.entity.SocioJpaEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "membresia", schema = "fitclub")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class MembresiaJpaEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "socio_id", nullable = false)
    private SocioJpaEntity socio;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "plan_id", nullable = false)
    private PlanJpaEntity plan;

    @Column(name = "fecha_inicio", nullable = false)
    private LocalDate fechaInicio;

    @Column(name = "fecha_fin", nullable = false)
    private LocalDate fechaFin;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoMembresia estado;
}