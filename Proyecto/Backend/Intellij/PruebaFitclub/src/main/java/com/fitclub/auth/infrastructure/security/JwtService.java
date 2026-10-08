package com.fitclub.auth.infrastructure.security;

import com.fitclub.auth.application.port.out.TokenServicePort;
import com.fitclub.auth.domain.model.Usuario;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
public class JwtService implements TokenServicePort {

    @Value("${fitclub.jwt.secret}")
    private String secret;

    @Value("${fitclub.jwt.expiration-ms}")
    private long expirationMs;

    @Override
    public String generarToken(Usuario usuario) {
        Date ahora = new Date();

        return Jwts.builder()
                .subject(usuario.getEmail())
                .claim("rol", usuario.getRol().name())
                .issuedAt(ahora)
                .expiration(new Date(ahora.getTime() + expirationMs))
                .signWith(clave())
                .compact();
    }

    @Override
    public String extraerEmail(String token) {
        return claims(token).getSubject();
    }

    @Override
    public boolean esValido(String token, Usuario usuario) {
        try {
            Claims claims = claims(token);

            return usuario.getEmail().equalsIgnoreCase(claims.getSubject())
                    && claims.getExpiration().after(new Date())
                    && Boolean.TRUE.equals(usuario.getActivo());
        } catch (Exception e) {
            return false;
        }
    }

    private Claims claims(String token) {
        return Jwts.parser()
                .verifyWith(clave())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    private SecretKey clave() {
        return Keys.hmacShaKeyFor(
                secret.getBytes(StandardCharsets.UTF_8)
        );
    }
}