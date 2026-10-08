package com.fitclub.auth.application.port.in;

import com.fitclub.auth.domain.model.LoginResultado;
public interface AuthUseCase {
    LoginResultado login(String email, String password);
}