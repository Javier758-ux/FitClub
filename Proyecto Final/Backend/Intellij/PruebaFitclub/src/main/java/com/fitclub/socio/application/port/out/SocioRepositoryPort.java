package com.fitclub.socio.application.port.out;

import com.fitclub.shared.domain.model.Pagina;
import com.fitclub.socio.domain.model.Socio;

import java.util.List;
import java.util.Optional;

public interface SocioRepositoryPort {
    Socio guardar(Socio socio);
    List<Socio> listar();
    Pagina<Socio> buscar(String texto, int pagina, int tamanio);
    Optional<Socio> buscarPorId(Long id);
}