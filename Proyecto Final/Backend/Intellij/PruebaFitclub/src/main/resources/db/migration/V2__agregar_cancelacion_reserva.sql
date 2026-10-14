ALTER TABLE fitclub.reserva_clase
    ADD COLUMN fecha_cancelacion TIMESTAMP NULL,
    ADD COLUMN cancelacion_tardia BOOLEAN NOT NULL DEFAULT FALSE;