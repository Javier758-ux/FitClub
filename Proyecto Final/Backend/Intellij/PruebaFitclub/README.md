# FitClub — Backend

Backend del proyecto FitClub (Programación Aplicada, PA-08): gestión de socios, membresías,
planes, instructores, clases, horarios, reservas, asistencia, historial de membresías,
notificaciones, reportes de ocupación y autenticación/roles. Construido en Java 21 + Spring Boot
con arquitectura hexagonal (dominio / aplicación / infraestructura por módulo) y PostgreSQL.

## Requisitos

- Java 21
- Maven (o usar el wrapper `./mvnw` si el proyecto lo incluye)
- Docker y Docker Compose (para levantar PostgreSQL y para correr la prueba de integración)

## 1. Levantar la base de datos

El proyecto incluye un `docker-compose.yml` con un PostgreSQL ya configurado con la misma base,
usuario y puerto que espera `application.properties`:

```bash
docker compose up -d
```

Esto crea la base `newfitclub` en `localhost:5432` con el usuario `bdfitclub`. La contraseña se
puede dejar con el valor de desarrollo por defecto, o fijarse explícitamente antes de levantar el
contenedor:

```bash
export FITCLUB_DB_PASSWORD=mi_password_local
docker compose up -d
```

## 2. Variables de entorno

Ninguna es obligatoria para correr en local (todas tienen un valor de desarrollo por defecto en
`application.properties`), pero sí se recomienda definirlas antes de compartir el proyecto o
desplegarlo en cualquier entorno que no sea la máquina de un desarrollador:

| Variable                  | Para qué sirve                                  | Valor por defecto (solo desarrollo) |
|----------------------------|--------------------------------------------------|--------------------------------------|
| `FITCLUB_DB_PASSWORD`      | Contraseña de PostgreSQL                         | `12345`                              |
| `FITCLUB_JWT_SECRET`       | Clave para firmar los tokens JWT                 | `FitClubJwtSecretKey2026Development...` |
| `FITCLUB_ADMIN_EMAIL`      | Email del usuario administrador inicial          | `admin@fitclub.com`                  |
| `FITCLUB_ADMIN_PASSWORD`   | Password del usuario administrador inicial       | `Admin123*`                          |

El usuario administrador se crea automáticamente la primera vez que arranca la aplicación
(`AdminInitializer`), con el email y password de las variables anteriores.

## 3. Migraciones de base de datos

No hay que correr nada a mano: Flyway corre automáticamente las migraciones de
`src/main/resources/db/migration` apenas arranca la aplicación, y crea el esquema `fitclub` dentro
de la base `newfitclub` si todavía no existe.

## 4. Correr el backend

```bash
mvn spring-boot:run
```

La API queda disponible en `http://localhost:8080`.

## 5. Probar la API

- **Swagger / OpenAPI**: `http://localhost:8080/swagger-ui/index.html` — documentación interactiva
  de todos los endpoints, generada automáticamente (springdoc-openapi). Es el punto de partida para
  que frontend/móvil conozcan el contrato sin tener que leer el código del backend.
- **Login**: `POST /api/auth/login` con `{"email": "...", "password": "..."}` devuelve un JWT.
  Para los demás endpoints protegidos, enviar ese token como `Authorization: Bearer <token>`.
- El primer login disponible es el del administrador por defecto (ver variables de entorno arriba).

## 6. Correr las pruebas

```bash
mvn test
```

Esto corre:

- **Pruebas unitarias** (`*ServiceTest`) de las reglas de negocio críticas: vigencia y vencimiento
  automático de membresía, cupo máximo de una clase, solapamiento de horario de un instructor y
  reserva duplicada. No requieren Docker ni base de datos — corren en milisegundos.
- **Prueba de integración** (`AuthIntegrationTest`): levanta un PostgreSQL real con Testcontainers,
  corre las migraciones de Flyway tal cual están (incluyendo el índice único parcial sobre
  `reserva_clase`, que no es compatible con bases de datos en memoria como H2 — por eso esta prueba
  usa Postgres real), arranca el contexto completo de Spring (seguridad, JWT, creación del admin) y
  ejercita `/api/auth/login` y `/api/auth/me` de punta a punta. **Requiere Docker disponible** en la
  máquina donde se ejecuta `mvn test` (igual que el paso 1). En GitHub Actions corre sin
  configuración adicional, porque los runners de `ubuntu-latest` ya traen Docker.

## Estructura del proyecto

Arquitectura hexagonal por módulo de negocio (`socio`, `membresia`, `plan`, `instructor`, `clase`,
`horario`, `reserva`, `asistencia`, `historialmembresia`, `notificacion`, `reporte`, `auth`), cada
uno con:

```
<modulo>/
  domain/       modelo y excepciones de negocio, sin dependencias de frameworks
  application/
    port/in/    casos de uso (lo que expone el módulo)
    port/out/   puertos hacia infraestructura (lo que el módulo necesita)
    service/    implementación de los casos de uso
  infrastructure/
    adapter/in/web/   controladores REST, DTOs y mappers
    adapter/out/persistence/  entidades JPA, mappers y repositorios Spring Data
```

Seguridad: Spring Security + JWT, sesiones STATELESS, 4 roles (`ADMINISTRADOR`, `RECEPCION`,
`INSTRUCTOR`, `SOCIO`) con permisos diferenciados por endpoint (ver `SecurityConfig`).

## Qué NO expone esta API (a propósito)

- No hay `DELETE` en ningún recurso — no está pedido por la ficha oficial del proyecto.
- No hay procesamiento de pagos reales — prohibido explícitamente por las reglas de negocio del
  proyecto.
