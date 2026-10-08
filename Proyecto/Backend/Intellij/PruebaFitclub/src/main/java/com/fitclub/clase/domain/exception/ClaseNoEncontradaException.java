package com.fitclub.clase.domain.exception;

public class ClaseNoEncontradaException extends RuntimeException {

    public ClaseNoEncontradaException(Long id) {
        super("No se encontró la clase con ID: " + id);
    }
}
