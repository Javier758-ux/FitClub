package com.fitclub.asistencia.domain.exception;

public class AsistenciaDuplicadaException extends RuntimeException {

    public AsistenciaDuplicadaException() {
        super("Esta reserva ya tiene una asistencia registrada");
    }
}
