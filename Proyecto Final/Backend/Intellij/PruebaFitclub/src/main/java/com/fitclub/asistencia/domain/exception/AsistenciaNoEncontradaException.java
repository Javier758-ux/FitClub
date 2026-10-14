package com.fitclub.asistencia.domain.exception;

public class AsistenciaNoEncontradaException extends RuntimeException {
    public AsistenciaNoEncontradaException(Long id) {
        super("No se encontró la asistencia con ID: " + id);
    }
}
