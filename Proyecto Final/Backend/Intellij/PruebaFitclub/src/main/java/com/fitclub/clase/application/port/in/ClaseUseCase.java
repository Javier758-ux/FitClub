package com.fitclub.clase.application.port.in;

import com.fitclub.clase.domain.model.Clase;
import com.fitclub.shared.domain.model.Pagina;

import java.util.List;
import java.util.Optional;

public interface ClaseUseCase {
    Clase registrar(Clase clase);
    Clase actualizar(Long id, Clase clase);
    List<Clase> listar();
    Pagina<Clase> buscar(String texto, int pagina, int tamanio);
    Optional<Clase> buscarPorId(Long id);
}