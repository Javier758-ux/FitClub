package com.fitclub.socio.infrastructure.adapter.out.persistence;

import com.fitclub.shared.domain.model.Pagina;
import com.fitclub.socio.application.port.out.SocioRepositoryPort;
import com.fitclub.socio.domain.model.Socio;
import com.fitclub.socio.infrastructure.adapter.out.persistence.entity.SocioJpaEntity;
import com.fitclub.socio.infrastructure.adapter.out.persistence.mapper.SocioPersistenceMapper;
import com.fitclub.socio.infrastructure.adapter.out.persistence.repository.SpringDataSocioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class SocioPersistenceAdapter implements SocioRepositoryPort {
    private final SpringDataSocioRepository repository;

    @Override
    public Socio guardar(Socio socio) {
        SocioJpaEntity guardado = repository.save(SocioPersistenceMapper.toEntity(socio));
        return SocioPersistenceMapper.toDomain(guardado);
    }

    @Override
    public List<Socio> listar() {
        return repository.findAll().stream()
                .map(SocioPersistenceMapper::toDomain)
                .toList();
    }

    @Override
    public Pagina<Socio> buscar(String texto, int pagina, int tamanio) {
        var pageable = PageRequest.of(
                pagina,
                tamanio,
                Sort.by("nombre").ascending()
        );

        var resultado = texto == null || texto.isBlank()
                ? repository.findAll(pageable)
                : repository.findByNombreContainingIgnoreCaseOrEmailContainingIgnoreCase(
                texto,
                texto,
                pageable
        );

        return new Pagina<>(
                resultado.getContent().stream()
                        .map(SocioPersistenceMapper::toDomain)
                        .toList(),
                resultado.getNumber(),
                resultado.getSize(),
                resultado.getTotalElements(),
                resultado.getTotalPages()
        );
    }

    @Override
    public Optional<Socio> buscarPorId(Long id) {
        return repository.findById(id)
                .map(SocioPersistenceMapper::toDomain);
    }
}