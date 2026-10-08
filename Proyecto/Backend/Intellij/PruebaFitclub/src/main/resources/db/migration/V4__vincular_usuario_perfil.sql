ALTER TABLE fitclub.usuario
    ADD COLUMN socio_id BIGINT NULL,
    ADD COLUMN instructor_id BIGINT NULL,

    ADD CONSTRAINT fk_usuario_socio
        FOREIGN KEY (socio_id)
        REFERENCES fitclub.socio(id),

    ADD CONSTRAINT fk_usuario_instructor
        FOREIGN KEY (instructor_id)
        REFERENCES fitclub.instructor(id),

    ADD CONSTRAINT uq_usuario_socio UNIQUE (socio_id),
    ADD CONSTRAINT uq_usuario_instructor UNIQUE (instructor_id),

    ADD CONSTRAINT ck_usuario_perfil CHECK (
        (rol = 'SOCIO' AND socio_id IS NOT NULL AND instructor_id IS NULL)
        OR
        (rol = 'INSTRUCTOR' AND instructor_id IS NOT NULL AND socio_id IS NULL)
        OR
        (rol IN ('ADMINISTRADOR', 'RECEPCION')
            AND socio_id IS NULL
            AND instructor_id IS NULL)
    );