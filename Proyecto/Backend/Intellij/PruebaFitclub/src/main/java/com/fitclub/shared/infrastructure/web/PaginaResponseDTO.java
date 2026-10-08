package com.fitclub.shared.infrastructure.web;

import java.util.List;

public record PaginaResponseDTO<T>(List<T> contenido, int pagina, int tamanio, long totalElementos, int totalPaginas) {

}