package com.fitclub.instructor.application.port.out;

import com.fitclub.instructor.domain.model.Instructor;
import com.fitclub.shared.domain.model.Pagina;

import java.util.List;
import java.util.Optional;

public interface InstructorRepositoryPort {
    Instructor guardar(Instructor instructor);
    List<Instructor> listar();
    Optional<Instructor> buscarPorId(Long id);
    Pagina<Instructor> buscar(String texto, int pagina, int tamanio);
}
