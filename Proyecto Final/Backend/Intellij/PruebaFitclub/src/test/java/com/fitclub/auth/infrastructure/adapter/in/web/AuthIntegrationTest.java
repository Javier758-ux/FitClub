package com.fitclub.auth.infrastructure.adapter.in.web;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.springframework.http.MediaType;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Prueba de integración real: levanta un contenedor de PostgreSQL con Testcontainers
 * (la misma imagen que usa docker-compose.yml para desarrollo), corre las migraciones
 * de Flyway tal cual están en src/main/resources/db/migration (incluido el índice único
 * parcial sobre reserva_clase, que H2 no soporta, por eso aquí se usa Postgres de verdad),
 * arranca el contexto completo de Spring (seguridad, JWT, AdminInitializer) y ejercita el
 * endpoint /api/auth/login de punta a punta.
 *
 * Requiere Docker disponible en la máquina donde se ejecuta (igual que docker-compose.yml
 * del punto 1). En GitHub Actions (ubuntu-latest) Docker ya viene disponible por defecto.
 */
@Testcontainers
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.MOCK)
@AutoConfigureMockMvc
class AuthIntegrationTest {

    @Container
    @ServiceConnection
    static final PostgreSQLContainer<?> postgres =
            new PostgreSQLContainer<>("postgres:16-alpine");

    @Autowired
    private MockMvc mockMvc;

    @DynamicPropertySource
    static void propiedadesDinamicas(DynamicPropertyRegistry registry) {
        // El esquema/usuario de la app son fijos (fitclub.*); @ServiceConnection ya
        // apunta spring.datasource.* al contenedor, acá solo garantizamos que Flyway
        // siga creando el esquema "fitclub" dentro de esa base de datos de prueba.
        registry.add("spring.flyway.create-schemas", () -> "true");
    }

    @Test
    @DisplayName("POST /api/auth/login con el admin por defecto (creado por AdminInitializer) devuelve 200 y un JWT")
    void loginConAdminPorDefectoDevuelveToken() throws Exception {
        String credenciales = """
                {
                  "email": "admin@fitclub.com",
                  "password": "Admin123*"
                }
                """;

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(credenciales))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.tipo").value("Bearer"))
                .andExpect(jsonPath("$.rol").value("ADMINISTRADOR"))
                .andExpect(jsonPath("$.token").isNotEmpty());
    }

    @Test
    @DisplayName("POST /api/auth/login con credenciales inválidas devuelve 401")
    void loginConCredencialesInvalidasDevuelve401() throws Exception {
        String credenciales = """
                {
                  "email": "admin@fitclub.com",
                  "password": "contraseñaIncorrecta"
                }
                """;

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(credenciales))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("GET /api/auth/me sin token devuelve 401 (endpoint protegido de punta a punta)")
    void meSinTokenDevuelve401() throws Exception {
        mockMvc.perform(get("/api/auth/me"))
                .andExpect(status().isUnauthorized());
    }
}
