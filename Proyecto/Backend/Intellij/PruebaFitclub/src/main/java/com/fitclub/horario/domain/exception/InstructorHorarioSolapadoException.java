package com.fitclub.horario.domain.exception;

public class InstructorHorarioSolapadoException extends RuntimeException {
    public InstructorHorarioSolapadoException() {
        super("El instructor ya tiene una clase asignada en ese horario");
    }
}