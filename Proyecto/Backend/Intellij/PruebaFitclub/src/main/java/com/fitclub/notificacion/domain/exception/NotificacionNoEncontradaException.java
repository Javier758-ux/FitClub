package com.fitclub.notificacion.domain.exception;

public class NotificacionNoEncontradaException extends RuntimeException {
    public NotificacionNoEncontradaException(Long id) {
        super("No se encontró la notificación con ID: " + id);
    }
}