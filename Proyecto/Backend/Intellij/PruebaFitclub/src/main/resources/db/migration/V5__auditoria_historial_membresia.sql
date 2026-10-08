ALTER TABLE fitclub.historial_membresia
    ADD COLUMN usuario_email VARCHAR(255);

UPDATE fitclub.historial_membresia
SET usuario_email = 'SISTEMA'
WHERE usuario_email IS NULL;

ALTER TABLE fitclub.historial_membresia
    ALTER COLUMN usuario_email SET NOT NULL;