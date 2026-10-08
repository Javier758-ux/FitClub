package com.fitclub.auth.application.port.out;

import java.util.Optional;

public interface SesionActualPort {
    Optional<String> obtenerEmail();
}