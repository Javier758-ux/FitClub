package com.fitclub.auth.infrastructure.security;

import com.fitclub.auth.application.port.out.UsuarioRepositoryPort;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfigurationSource;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {
    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public UserDetailsService userDetailsService(
            UsuarioRepositoryPort repository) {

        return email -> repository.buscarPorEmail(email)
                .map(usuario -> User.withUsername(usuario.getEmail())
                        .password(usuario.getPassword())
                        .roles(usuario.getRol().name())
                        .disabled(!Boolean.TRUE.equals(usuario.getActivo()))
                        .build())
                .orElseThrow(() ->
                        new UsernameNotFoundException(
                                "Usuario no encontrado"
                        ));
    }

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http,
            CorsConfigurationSource corsConfigurationSource) throws Exception {

        return http
                .cors(cors ->
                        cors.configurationSource(corsConfigurationSource))
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        ))
                .authorizeHttpRequests(auth -> auth

                        // PUBLICO
                        .requestMatchers(
                                "/api/auth/login",
                                "/v3/api-docs/**",
                                "/swagger-ui/**",
                                "/swagger-ui.html"
                        ).permitAll()

                        .requestMatchers(
                                HttpMethod.OPTIONS,
                                "/**"
                        ).permitAll()

                        // USUARIO AUTENTICADO
                        .requestMatchers("/api/auth/me")
                        .authenticated()

                        // USUARIOS
                        .requestMatchers("/api/usuarios/**")
                        .hasRole("ADMINISTRADOR")

                        // DATOS PROPIOS DEL SOCIO
                        .requestMatchers(
                                "/api/membresias/mias",
                                "/api/reservas/mias",
                                "/api/reservas/mias/**",
                                "/api/notificaciones/mias",
                                "/api/notificaciones/mias/**"
                        ).hasRole("SOCIO")

                        // DATOS PROPIOS DEL INSTRUCTOR
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/horarios/mios",
                                "/api/reservas/mis-clases/**"
                        ).hasRole("INSTRUCTOR")

                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/asistencias/mis-clases"
                        ).hasRole("INSTRUCTOR")

                        // CATALOGOS - LECTURA
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/clases/**",
                                "/api/horarios/**",
                                "/api/instructores/**",
                                "/api/planes/**"
                        ).hasAnyRole(
                                "ADMINISTRADOR",
                                "RECEPCION",
                                "INSTRUCTOR",
                                "SOCIO"
                        )

                        // CATALOGOS - MODIFICACION
                        .requestMatchers(
                                "/api/clases/**",
                                "/api/horarios/**",
                                "/api/instructores/**",
                                "/api/planes/**"
                        ).hasRole("ADMINISTRADOR")

                        // SOCIOS
                        .requestMatchers("/api/socios/**")
                        .hasAnyRole(
                                "ADMINISTRADOR",
                                "RECEPCION"
                        )

                        // MEMBRESIAS
                        .requestMatchers("/api/membresias/**")
                        .hasAnyRole(
                                "ADMINISTRADOR",
                                "RECEPCION"
                        )

                        // HISTORIAL
                        .requestMatchers("/api/historial-membresias/**")
                        .hasAnyRole(
                                "ADMINISTRADOR",
                                "RECEPCION"
                        )

                        // ASISTENCIAS GENERALES
                        .requestMatchers("/api/asistencias/**")
                        .hasAnyRole(
                                "ADMINISTRADOR",
                                "RECEPCION"
                        )

                        // RESERVAS - CONSULTA
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/reservas/**"
                        ).hasAnyRole(
                                "ADMINISTRADOR",
                                "RECEPCION"
                        )

                        // RESERVAS - CREAR/CANCELAR
                        .requestMatchers("/api/reservas/**")
                        .hasAnyRole(
                                "ADMINISTRADOR",
                                "RECEPCION"
                        )

                        // NOTIFICACIONES
                        .requestMatchers("/api/notificaciones/**")
                        .hasAnyRole(
                                "ADMINISTRADOR",
                                "RECEPCION"
                        )

                        // REPORTES
                        .requestMatchers("/api/reportes/**")
                        .hasAnyRole(
                                "ADMINISTRADOR",
                                "RECEPCION",
                                "INSTRUCTOR"
                        )

                        .anyRequest()
                        .hasRole("ADMINISTRADOR")
                )
                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                )
                .build();
    }
}