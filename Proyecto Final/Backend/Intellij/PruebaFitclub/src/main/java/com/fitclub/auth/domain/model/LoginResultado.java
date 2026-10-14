package com.fitclub.auth.domain.model;

public record LoginResultado(String token, Long usuarioId, String nombre, String email, Rol rol) {

}