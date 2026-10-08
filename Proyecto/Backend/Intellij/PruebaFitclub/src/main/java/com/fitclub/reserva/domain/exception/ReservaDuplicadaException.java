package com.fitclub.reserva.domain.exception;

public class ReservaDuplicadaException extends RuntimeException {
    public ReservaDuplicadaException() {
        super("El socio ya tiene una reserva activa para este horario");
    }
}