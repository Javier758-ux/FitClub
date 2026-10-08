package com.fitclub.reserva.domain.exception;

public class ReservaClaseNoEncontradaException extends RuntimeException {
    public ReservaClaseNoEncontradaException(Long id) {
        super("No se encontró la reserva con ID: " + id);
    }
}