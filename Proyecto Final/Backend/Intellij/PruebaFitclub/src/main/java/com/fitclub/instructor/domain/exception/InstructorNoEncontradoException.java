package com.fitclub.instructor.domain.exception;

public class InstructorNoEncontradoException extends RuntimeException {
    public InstructorNoEncontradoException(Long id) {
        super("No se encontró el instructor con ID: " + id);
    }
}