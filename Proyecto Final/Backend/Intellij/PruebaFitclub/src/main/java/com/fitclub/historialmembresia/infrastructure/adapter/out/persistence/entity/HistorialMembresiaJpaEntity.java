package com.fitclub.historialmembresia.infrastructure.adapter.out.persistence.entity;

import com.fitclub.membresia.domain.model.EstadoMembresia;
import com.fitclub.membresia.infrastructure.adapter.out.persistence.entity.MembresiaJpaEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "historial_membresia", schema = "fitclub")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class HistorialMembresiaJpaEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "membresia_id", nullable = false)
    private MembresiaJpaEntity membresia;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado_anterior")
    private EstadoMembresia estadoAnterior;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado_nuevo", nullable = false)
    private EstadoMembresia estadoNuevo;

    @Column(name = "fecha_cambio", nullable = false)
    private LocalDateTime fechaCambio;

    private String motivo;

    @Column(name = "usuario_email", nullable = false)
    private String usuarioEmail;
}