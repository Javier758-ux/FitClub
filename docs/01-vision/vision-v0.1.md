# Visión del Proyecto FitClub

> Este documento también vive en el [Notion del equipo](https://app.notion.com/p/3e68c96c494981ffa550ea4e3c061821), junto al Tablero de Proyecto y los Incidentes y Lecciones Aprendidas. Esta copia queda en el repositorio para que sea consultable sin depender de Notion.

## Resumen

FitClub es un sistema de gestión para un gimnasio/club deportivo — Proyecto PA-08, Programación Aplicada 2026-2. El objetivo final del proyecto es centralizar el registro y control de **socios**, **membresías/planes**, **clases**, **instructores**, **horarios**, **reservas**, **asistencia** y **notificaciones**.

Este documento distingue dos alcances que conviene no confundir:

- **La visión completa del proyecto** (lo que el equipo se propone construir en total).
- **El alcance de este primer parcial** (lo que ya está construido y verificado de punta a punta, en el sandbox `PruebaFitclub`, limitado a Socio y Membresía).

## Planteamiento del problema

Un gimnasio que gestiona su operación de forma manual o dispersa (planillas, cuadernos, mensajes sueltos) acumula problemas conocidos:

- No hay una fuente única y validada de quiénes son los socios y qué membresía tiene cada uno — es fácil duplicar registros o dejar datos incompletos.
- No hay visibilidad clara de qué membresías están vigentes, por vencer o vencidas.
- Las clases (horarios, cupos, instructores) se coordinan sin un sistema que evite choques de horario o sobrecupo.
- No queda registro confiable de la asistencia de cada socio a las clases.
- No existe un mecanismo para notificar automáticamente a un socio (por ejemplo, que su membresía está por vencer, o que una clase reservada cambió de horario).

FitClub busca resolver esto centralizando estos procesos en un sistema con datos validados, relaciones consistentes entre entidades, y una API clara que pueda sostener, más adelante, una interfaz de usuario real.

## Visión

Construir un backend (y eventualmente una interfaz) que cubra el ciclo completo de operación de un gimnasio, organizado en tres módulos de dominio:

| Módulo | Entidades |
|---|---|
| `socio` | Socio, Notificación |
| `plan` | Plan, Membresía, Historial de membresía |
| `clase` | Clase, Instructor, Horario de clase, Reserva de clase, Asistencia |

La arquitectura debe permitir que el sistema crezca sin reescribirse: dominio separado de la persistencia, lógica de negocio desacoplada del framework, y una API documentada automáticamente para que cualquier cliente (front-end propio, o quien integre después) pueda consumirla sin adivinar el contrato.

## Objetivos

### Objetivo general

Diseñar e implementar el backend de FitClub para la gestión integral de un gimnasio — socios, membresías, clases, instructores, horarios, reservas, asistencia y notificaciones — aplicando buenas prácticas de arquitectura, persistencia y manejo de errores, de forma incremental por capítulo/corte del curso.

### Objetivos específicos

1. Modelar el dominio completo de las 10 entidades en Java puro, sin acoplarlo a infraestructura (Cap.01-02 — ya hecho en `backend/`).
2. Aplicar el patrón de contrato de repositorio (interfaz + implementación + servicio + excepciones propias) a cada módulo, empezando por Socio → Membresía (Cap.02 — ya hecho).
3. Llevar un primer recorte del dominio (Socio y Membresía) de punta a punta con Spring Boot real: HTTP, persistencia JPA, arquitectura hexagonal, relación 1:N, manejo global de errores y documentación Swagger — verificado end-to-end (Cap.04-08, ya hecho en `PruebaFitclub`).
4. Extender ese mismo tratamiento (hexagonal + persistencia + errores + documentación) al resto de los módulos — `plan` (Membresía completa, Historial) y `clase` (Clase, Instructor, Horario, Reserva, Asistencia) — en los siguientes cortes.
5. Mantener documentación honesta del proceso — decisiones, incidentes, responsables reales — para sustentar la comprensión individual del proyecto completo en cada defensa oral.

## Alcance del proyecto

### Alcance total (visión completa)

Las 10 entidades de los 3 módulos (`socio`, `plan`, `clase`), con backend completo y, eventualmente, una interfaz de usuario, autenticación y notificaciones automáticas.

### Alcance verificado en este primer parcial

Construido y probado de punta a punta en `PruebaFitclub` (sandbox de práctica para este corte, dominio reducido a 2 entidades para poder demostrar la arquitectura completa sin la extensión del proyecto final):

- CRUD parcial (crear y consultar) de Socio y Membresía.
- Validación de datos de entrada en ambos módulos.
- Persistencia en PostgreSQL con schema propio (`fitclub`), dominio separado de la persistencia.
- Arquitectura hexagonal (puertos IN/OUT + adaptadores).
- Relación 1:N Socio↔Membresía con integridad referencial real.
- Manejo global de errores (404, 400, 409, 500) con formato de respuesta consistente.
- Documentación automática de la API vía Swagger/OpenAPI.

Además, el modelado de dominio en Java puro (Cap.01) y el patrón de repositorio (Cap.02) ya están hechos para las **10 entidades**, en `backend/` — es la base sobre la que se construirá el resto.

### Fuera de este corte (pendiente para cortes siguientes)

- Los módulos `plan` (más allá de Membresía básica) y `clase` completos: Instructor, Horario, Reserva, Asistencia, Notificación — llevados con la misma arquitectura que ya se validó en Socio/Membresía.
- Endpoints de actualización y eliminación (`PUT`, `DELETE`).
- Paginación en los listados.
- Pruebas automatizadas (unitarias/integración).
- Interfaz de usuario (frontend).
- Autenticación y autorización.

El detalle de qué está pendiente, quién lo tiene asignado y su estado actual se sigue en el Tablero de Proyecto del [Notion del equipo](https://app.notion.com/p/e460159e6acb44ac98182893bc991c69) — esta sección solo fija el límite formal de lo que el equipo se comprometió a entregar en este corte.
