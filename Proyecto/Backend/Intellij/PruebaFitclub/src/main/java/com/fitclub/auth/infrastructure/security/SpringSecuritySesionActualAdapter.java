package com.fitclub.auth.infrastructure.security;

import com.fitclub.auth.application.port.out.SesionActualPort;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class SpringSecuritySesionActualAdapter implements SesionActualPort {

    @Override
    public Optional<String> obtenerEmail() {
        var authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null
                || !authentication.isAuthenticated()
                || authentication instanceof AnonymousAuthenticationToken) {
            return Optional.empty();
        }

        return Optional.ofNullable(authentication.getName());
    }
}