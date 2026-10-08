package com.fitclub.auth.infrastructure.adapter.out.persistence;

import com.fitclub.auth.application.port.out.UsuarioRepositoryPort;
import com.fitclub.auth.domain.model.Usuario;
import com.fitclub.auth.infrastructure.adapter.out.persistence.mapper.UsuarioPersistenceMapper;
import com.fitclub.auth.infrastructure.adapter.out.persistence.repository.SpringDataUsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class UsuarioPersistenceAdapter implements UsuarioRepositoryPort {

    private final SpringDataUsuarioRepository repository;

    @Override
    public Usuario guardar(Usuario usuario) {
        return UsuarioPersistenceMapper.toDomain(
                repository.save(UsuarioPersistenceMapper.toEntity(usuario))
        );
    }

    @Override
    public Optional<Usuario> buscarPorEmail(String email) {
        return repository.findByEmailIgnoreCase(email)
                .map(UsuarioPersistenceMapper::toDomain);
    }

    @Override
    public Optional<Usuario> buscarPorId(Long id) {
        return repository.findById(id)
                .map(UsuarioPersistenceMapper::toDomain);
    }

    @Override
    public List<Usuario> listar() {
        return repository.findAll().stream()
                .map(UsuarioPersistenceMapper::toDomain)
                .toList();
    }

    @Override
    public boolean existePorSocioId(Long socioId) {
        return repository.existsBySocioId(socioId);
    }

    @Override
    public boolean existePorInstructorId(Long instructorId) {
        return repository.existsByInstructorId(instructorId);
    }
}