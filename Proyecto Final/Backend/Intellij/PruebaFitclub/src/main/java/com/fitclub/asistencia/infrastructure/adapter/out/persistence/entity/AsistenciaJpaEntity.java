package com.fitclub.asistencia.infrastructure.adapter.out.persistence.entity;

import com.fitclub.reserva.infrastructure.adapter.out.persistence.entity.ReservaClaseJpaEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "asistencia", schema = "fitclub")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class AsistenciaJpaEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "reserva_clase_id", nullable = false, unique = true)
    private ReservaClaseJpaEntity reservaClase;

    @Column(name = "fecha_registro", nullable = false)
    private LocalDateTime fechaRegistro;

    @Column(nullable = false)
    private Boolean presente;
}