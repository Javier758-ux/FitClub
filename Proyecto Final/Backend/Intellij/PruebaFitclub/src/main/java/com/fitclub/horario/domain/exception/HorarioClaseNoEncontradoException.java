package com.fitclub.horario.domain.exception;

public class HorarioClaseNoEncontradoException extends RuntimeException {
    public HorarioClaseNoEncontradoException(Long id) {
        super("No se encontró el horario con ID: " + id);
    }
}