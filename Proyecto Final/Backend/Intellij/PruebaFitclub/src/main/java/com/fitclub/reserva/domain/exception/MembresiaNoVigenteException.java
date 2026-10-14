package com.fitclub.reserva.domain.exception;

public class MembresiaNoVigenteException extends RuntimeException {
    public MembresiaNoVigenteException() {
        super("El socio no tiene una membresía vigente");
    }
}