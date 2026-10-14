package com.fitclub.horario.domain.exception;

public class HorarioInvalidoException extends RuntimeException {
    public HorarioInvalidoException() {
        super("La hora de inicio debe ser anterior a la hora de fin");
    }

    public HorarioInvalidoException(String mensaje) {
        super(mensaje);
    }
}