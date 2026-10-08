package com.fitclub.plan.domain.exception;

public class PlanNoEncontradoException extends RuntimeException {
    public PlanNoEncontradoException(Long id) {
        super("No se encontró el plan con ID: " + id);
    }
}