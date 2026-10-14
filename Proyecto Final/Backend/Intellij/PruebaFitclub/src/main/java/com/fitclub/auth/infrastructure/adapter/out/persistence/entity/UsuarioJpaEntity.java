package com.fitclub.auth.infrastructure.adapter.out.persistence.entity;

import com.fitclub.auth.domain.model.Rol;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "usuario", schema = "fitclub")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class UsuarioJpaEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nombre;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Rol rol;

    @Column(nullable = false)
    private Boolean activo;

    @Column(name = "socio_id")
    private Long socioId;

    @Column(name = "instructor_id")
    private Long instructorId;
}