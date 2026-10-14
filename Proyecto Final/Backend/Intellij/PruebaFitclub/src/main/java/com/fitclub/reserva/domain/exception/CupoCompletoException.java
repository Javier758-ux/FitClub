package com.fitclub.reserva.domain.exception;

public class CupoCompletoException extends RuntimeException {
    public CupoCompletoException() {
        super("La clase ya alcanzó su cupo máximo");
    }
}