package com.fitclub.socio.application.port.in;

import com.fitclub.socio.domain.model.Socio;
import com.fitclub.shared.domain.model.Pagina;

import java.util.List;
import java.util.Optional;

public interface SocioUseCase {
    Socio registrar(Socio socio);
    Socio actualizar(Long id, Socio socio);
    List<Socio> listar();
    Optional<Socio> buscarPorId(Long id);
    Pagina<Socio> buscar(String texto, int pagina, int tamanio);
}