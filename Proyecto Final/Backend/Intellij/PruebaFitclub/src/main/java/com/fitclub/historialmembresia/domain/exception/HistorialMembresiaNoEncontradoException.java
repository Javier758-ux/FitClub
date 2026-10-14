package com.fitclub.historialmembresia.domain.exception;

public class HistorialMembresiaNoEncontradoException extends RuntimeException {
    public HistorialMembresiaNoEncontradoException(Long id) {
        super("No se encontró el historial de membresía con ID: " + id);
    }
}