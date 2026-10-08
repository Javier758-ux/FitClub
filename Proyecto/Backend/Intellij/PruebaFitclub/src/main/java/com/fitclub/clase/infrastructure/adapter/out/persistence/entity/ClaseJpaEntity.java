package com.fitclub.clase.infrastructure.adapter.out.persistence.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "clase", schema = "fitclub")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class ClaseJpaEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nombre;

    private String descripcion;

    @Column(name = "cupo_maximo", nullable = false)
    private Integer cupoMaximo;
}