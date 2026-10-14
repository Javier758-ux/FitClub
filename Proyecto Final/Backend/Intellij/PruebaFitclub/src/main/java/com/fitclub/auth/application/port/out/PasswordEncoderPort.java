package com.fitclub.auth.application.port.out;

public interface PasswordEncoderPort {
    String codificar(String password);
    boolean coincide(String password, String passwordCodificado);
}