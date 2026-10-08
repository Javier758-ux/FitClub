package com.fitclub.clase.application.port.out;

import com.fitclub.clase.domain.model.Clase;
import com.fitclub.shared.domain.model.Pagina;

import java.util.List;
import java.util.Optional;

public interface ClaseRepositoryPort {
    Clase guardar(Clase clase);
    List<Clase> listar();
    Pagina<Clase> buscar(String texto, int pagina, int tamanio);
    Optional<Clase> buscarPorId(Long id);
}