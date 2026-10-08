package com.fitclub.membresia.domain.exception;

public class CambioEstadoMembresiaInvalidoException extends RuntimeException {
    public CambioEstadoMembresiaInvalidoException(String mensaje) {
        super(mensaje);
    }
}