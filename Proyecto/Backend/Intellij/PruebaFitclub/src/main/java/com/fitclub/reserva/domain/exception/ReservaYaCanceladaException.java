package com.fitclub.reserva.domain.exception;

public class ReservaYaCanceladaException extends RuntimeException {
    public ReservaYaCanceladaException() {
        super("La reserva ya se encuentra cancelada");
    }
}