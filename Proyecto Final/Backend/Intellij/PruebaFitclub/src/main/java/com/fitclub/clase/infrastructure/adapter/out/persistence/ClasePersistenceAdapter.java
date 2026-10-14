package com.fitclub.clase.infrastructure.adapter.out.persistence;

import com.fitclub.clase.application.port.out.ClaseRepositoryPort;
import com.fitclub.clase.domain.model.Clase;
import com.fitclub.clase.infrastructure.adapter.out.persistence.mapper.ClasePersistenceMapper;
import com.fitclub.clase.infrastructure.adapter.out.persistence.repository.SpringDataClaseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import com.fitclub.shared.domain.model.Pagina;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;

import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class ClasePersistenceAdapter implements ClaseRepositoryPort {

    private final SpringDataClaseRepository repository;

    @Override
    public Clase guardar(Clase clase) {
        return ClasePersistenceMapper.toDomain(
                repository.save(ClasePersistenceMapper.toEntity(clase))
        );
    }

    @Override
    public List<Clase> listar() {
        return repository.findAll().stream()
                .map(ClasePersistenceMapper::toDomain)
                .toList();
    }

    @Override
    public Optional<Clase> buscarPorId(Long id) {
        return repository.findById(id)
                .map(ClasePersistenceMapper::toDomain);
    }

    @Override
    public Pagina<Clase> buscar(String texto, int pagina, int tamanio) {
        var pageable = PageRequest.of(
                pagina,
                tamanio,
                Sort.by("nombre").ascending()
        );

        var resultado = texto == null || texto.isBlank()
                ? repository.findAll(pageable)
                : repository.findByNombreContainingIgnoreCaseOrDescripcionContainingIgnoreCase(
                texto,
                texto,
                pageable
        );

        return new Pagina<>(
                resultado.getContent().stream()
                        .map(ClasePersistenceMapper::toDomain)
                        .toList(),
                resultado.getNumber(),
                resultado.getSize(),
                resultado.getTotalElements(),
                resultado.getTotalPages()
        );
    }
}
