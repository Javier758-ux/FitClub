package com.fitclub.auth.infrastructure.security;

import com.fitclub.auth.application.port.out.TokenServicePort;
import com.fitclub.auth.application.port.out.UsuarioRepositoryPort;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private final TokenServicePort tokenService;
    private final UsuarioRepositoryPort usuarioRepository;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        String header = request.getHeader("Authorization");

        if (header == null || !header.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = header.substring(7);

        try {
            String email = tokenService.extraerEmail(token);

            if (SecurityContextHolder.getContext().getAuthentication() == null) {
                usuarioRepository.buscarPorEmail(email).ifPresent(usuario -> {
                    if (tokenService.esValido(token, usuario)) {
                        var autoridad = new SimpleGrantedAuthority(
                                "ROLE_" + usuario.getRol().name()
                        );

                        var auth = new UsernamePasswordAuthenticationToken(
                                usuario.getEmail(),
                                null,
                                List.of(autoridad)
                        );

                        auth.setDetails(
                                new WebAuthenticationDetailsSource()
                                        .buildDetails(request)
                        );

                        SecurityContextHolder.getContext()
                                .setAuthentication(auth);
                    }
                });
            }
        } catch (Exception ignored) {
        }

        filterChain.doFilter(request, response);
    }
}