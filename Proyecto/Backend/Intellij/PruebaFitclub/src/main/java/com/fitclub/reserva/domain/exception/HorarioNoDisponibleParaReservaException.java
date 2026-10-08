package com.fitclub.reserva.domain.exception;

public class HorarioNoDisponibleParaReservaException extends RuntimeException {
    public HorarioNoDisponibleParaReservaException() {
        super("No se puede reservar una clase que ya inició o finalizó");
    }
}