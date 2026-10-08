package com.fitclub.shared.domain.model;

import java.util.List;

public record Pagina<T>(List<T> contenido, int pagina, int tamanio, long totalElementos, int totalPaginas) {

}