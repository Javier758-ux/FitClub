package com.fitclub.horario.infrastructure.adapter.out.persistence.entity;

import com.fitclub.clase.infrastructure.adapter.out.persistence.entity.ClaseJpaEntity;
import com.fitclub.instructor.infrastructure.adapter.out.persistence.entity.InstructorJpaEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "horario_clase", schema = "fitclub")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class HorarioClaseJpaEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "clase_id", nullable = false)
    private ClaseJpaEntity clase;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "instructor_id", nullable = false)
    private InstructorJpaEntity instructor;

    @Column(nullable = false)
    private LocalDate fecha;

    @Column(name = "hora_inicio", nullable = false)
    private LocalTime horaInicio;

    @Column(name = "hora_fin", nullable = false)
    private LocalTime horaFin;
}