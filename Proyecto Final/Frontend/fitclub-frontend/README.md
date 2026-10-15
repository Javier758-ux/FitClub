# FitClub Frontend Web

Frontend web del proyecto integrador **PA-08 FitClub — Membresías, Clases y Reservas de Centro Deportivo**, desarrollado para la materia **Programación Aplicada 2026-2**.

La aplicación web consume la API REST del backend FitClub desarrollado con Java 21 y Spring Boot.

---

## Tecnologías

- React 19
- TypeScript
- Vite
- React Router
- Vitest
- Testing Library
- Oxlint
- API REST con Spring Boot

---

## Requisitos previos

Para ejecutar el frontend se necesita:

- Node.js
- npm
- Backend FitClub ejecutándose
- PostgreSQL configurado para el backend

Durante la ejecución local, la API debe estar disponible en:

```text
http://localhost:8080/api
```

---

## Instalación

Abrir una terminal en la carpeta:

```text
fitclub-frontend
```

Instalar las dependencias:

```bash
npm install
```

---

## Variables de entorno

El proyecto utiliza:

```env
VITE_API_URL=http://localhost:8080/api
```

Los archivos de configuración incluidos son:

```text
.env
.env.development
.env.production
.env.example
```

La configuración actual está preparada para una demostración local con el backend Spring Boot ejecutándose en el puerto `8080`.

Si en el futuro el backend se despliega en Internet, debe modificarse `.env.production` con la URL correspondiente.

No deben almacenarse contraseñas, tokens JWT ni otras credenciales privadas dentro de las variables del frontend.

---

## Ejecutar el proyecto

Primero iniciar PostgreSQL y el backend FitClub.

Después ejecutar:

```bash
npm run dev
```

Vite mostrará una dirección similar a:

```text
http://localhost:5173
```

Abrir esa dirección en el navegador.

---

## Generar build

Ejecutar:

```bash
npm run build
```

Este comando:

1. verifica el código TypeScript;
2. compila la aplicación;
3. genera la carpeta `dist`.

---

## Previsualizar la build

Después de generar la build:

```bash
npm run preview
```

La aplicación utilizará la configuración definida en:

```text
.env.production
```

Actualmente:

```env
VITE_API_URL=http://localhost:8080/api
```

---

## Ejecutar pruebas

Ejecutar todas las pruebas una sola vez:

```bash
npm run test:run
```

Para ejecutar Vitest en modo interactivo:

```bash
npm run test
```

Actualmente existen pruebas sobre:

- protección de rutas;
- permisos de acceso;
- manejo del JWT;
- cierre de sesión ante HTTP 401;
- formulario de socios;
- formulario de reservas;
- formulario de membresías;
- registro de asistencia;
- MetricCard;
- Pagination;
- SearchInput.

---

## Ejecutar linter

```bash
npm run lint
```

---

# Arquitectura del frontend

La aplicación está organizada por responsabilidades.

```text
src/
├── app/
│   └── manejo global de errores
├── auth/
│   ├── contexto de autenticación
│   ├── almacenamiento del JWT
│   ├── permisos
│   └── protección de rutas
├── components/
│   ├── formularios
│   ├── tablas
│   ├── calendario
│   └── componentes UI reutilizables
├── config/
│   └── variables de entorno
├── hooks/
│   └── hooks reutilizables
├── layouts/
│   └── estructura principal de la aplicación
├── models/
│   └── contratos y modelos TypeScript
├── pages/
│   └── páginas de cada módulo
├── routes/
│   └── definición de rutas
├── services/
│   └── comunicación con la API REST
├── styles/
│   └── estilos globales
├── test/
│   └── configuración de pruebas
└── utils/
    └── utilidades
```

---

# Autenticación

FitClub utiliza autenticación mediante JWT.

Flujo general:

```text
Login
  ↓
POST /api/auth/login
  ↓
JWT
  ↓
sessionStorage
  ↓
GET /api/auth/me
  ↓
AuthContext
  ↓
Usuario + rol
```

El JWT se agrega automáticamente a las solicitudes protegidas mediante:

```http
Authorization: Bearer <token>
```

Si el backend responde:

```text
401 Unauthorized
```

el frontend:

1. elimina el token;
2. invalida la sesión;
3. actualiza el contexto de autenticación;
4. redirige al usuario al login.

---

# Roles

FitClub trabaja con cuatro roles:

```text
ADMINISTRADOR
RECEPCION
INSTRUCTOR
SOCIO
```

Los permisos visuales del frontend siguen los permisos definidos por el backend.

---

## ADMINISTRADOR

Tiene acceso a:

- Dashboard
- Socios
- Planes
- Membresías
- Instructores
- Clases
- Horarios
- Reservas
- Asistencias
- Notificaciones
- Reportes

También puede crear y modificar los catálogos administrativos.

---

## RECEPCION

Puede acceder a:

- Dashboard
- Socios
- Planes
- Membresías
- Instructores
- Clases
- Horarios
- Reservas
- Asistencias
- Notificaciones
- Reportes

Los catálogos de planes, instructores, clases y horarios se presentan principalmente en modo consulta cuando su modificación corresponde al Administrador.

---

## INSTRUCTOR

Puede:

- consultar catálogos;
- consultar horarios;
- consultar sus clases;
- ver participantes;
- registrar asistencia;
- consultar reportes.

---

## SOCIO

Puede:

- consultar clases;
- consultar horarios;
- consultar planes;
- consultar instructores;
- consultar sus reservas;
- crear reservas;
- cancelar sus reservas;
- consultar sus notificaciones;
- marcar sus notificaciones como leídas;
- consultar la vigencia de su membresía desde el Dashboard.

---

# Módulos

## Dashboard

Presenta información general de FitClub:

- cantidad de clases;
- cantidad de horarios;
- cantidad de instructores;
- cantidad de planes;
- vigencias de membresías;
- ocupación de horarios.

Para Administración y Recepción también muestra:

```text
ACTIVAS
VENCIDAS
SUSPENDIDAS
CANCELADAS
PRÓXIMAS A VENCER
```

Para el Socio muestra información relacionada con su propia membresía.

---

## Socios

Permite:

- registrar socios;
- consultar socios;
- buscar socios;
- editar información;
- paginar resultados.

---

## Planes

Permite consultar:

- nombre;
- descripción;
- precio;
- duración.

El Administrador también puede:

- crear planes;
- editar planes.

---

## Membresías

Permite:

- registrar membresías;
- consultar vigencia;
- suspender;
- reactivar;
- cancelar;
- filtrar por estado;
- consultar historial de cambios.

Estados utilizados:

```text
ACTIVA
SUSPENDIDA
VENCIDA
CANCELADA
```

El historial permite consultar:

- membresía afectada;
- estado anterior;
- estado nuevo;
- motivo;
- fecha;
- usuario responsable.

---

## Instructores

Permite consultar:

- nombre;
- correo;
- teléfono;
- especialidad.

El Administrador puede:

- crear instructores;
- editar instructores.

---

## Clases

Permite consultar:

- nombre;
- descripción;
- cupo máximo.

El Administrador puede:

- crear clases;
- editar clases.

---

## Horarios

Relaciona:

```text
Clase
+
Instructor
+
Fecha
+
Hora de inicio
+
Hora de finalización
```

Dispone de dos vistas:

```text
Lista
Calendario de instructores
```

Los horarios pueden filtrarse por:

- clase;
- instructor;
- búsqueda textual.

El Administrador puede crear y editar horarios.

---

## Reservas

El SOCIO puede:

- consultar sus reservas;
- realizar una reserva;
- cancelar una reserva.

ADMINISTRADOR y RECEPCION pueden:

- consultar reservas;
- registrar una reserva para un socio;
- cancelar reservas.

Las reglas críticas son validadas por el backend.

Entre ellas:

- membresía vigente;
- disponibilidad de cupo;
- reserva duplicada;
- horario permitido.

---

## Asistencia

ADMINISTRADOR y RECEPCION pueden:

- consultar asistencias;
- registrar asistencia.

El INSTRUCTOR puede:

1. seleccionar una fecha;
2. consultar sus horarios;
3. seleccionar una clase;
4. consultar participantes con reserva;
5. registrar al participante como presente o ausente.

---

## Notificaciones

ADMINISTRADOR y RECEPCION pueden:

- crear notificaciones;
- consultar notificaciones;
- marcar notificaciones como leídas.

El SOCIO puede:

- consultar sus propias notificaciones;
- marcar sus notificaciones como leídas.

---

## Reportes

Permite consultar la ocupación por horario.

El reporte presenta:

- clase;
- horario;
- instructor;
- cupo máximo;
- reservas activas;
- cupos disponibles;
- porcentaje de ocupación.

Actualmente el backend calcula la ocupación utilizando las reservas activas y el cupo máximo del horario.

---

# Flujo crítico

El flujo principal de FitClub es:

```text
Socio autenticado
        ↓
Consulta clases y horarios
        ↓
Solicita una reserva
        ↓
Backend valida membresía vigente
        ↓
Backend valida disponibilidad de cupo
        ↓
Se registra la reserva
        ↓
Instructor consulta sus horarios
        ↓
Consulta participantes
        ↓
Registra asistencia
        ↓
Administración consulta indicadores
```

Las reglas críticas pertenecen al backend.

React realiza validaciones de experiencia de usuario, pero Spring Boot conserva la autoridad final sobre las reglas del negocio.

---

# Manejo de estados de interfaz

Las pantallas contemplan estados como:

```text
Loading
Success
Error
Empty
Disabled
```

También se utilizan confirmaciones antes de operaciones sensibles.

Ejemplos:

```text
Cancelar reserva
Cancelar membresía
```

---

# Manejo de errores HTTP

La comunicación con el backend está centralizada en:

```text
src/services/apiClient.ts
```

Se manejan respuestas como:

```text
401 → sesión inválida o vencida
403 → usuario sin permisos
404 → recurso no encontrado
409 → conflicto de negocio
5xx → error del servidor
```

Los mensajes enviados por la API también pueden mostrarse en la interfaz cuando corresponde.

---

# Integración con backend

El frontend no contiene la lógica definitiva de las reglas críticas del negocio.

Ejemplos:

```text
Validar membresía vigente   → Backend
Controlar cupo              → Backend
Evitar reserva duplicada    → Backend
Evitar solapamiento         → Backend
Autorizar según rol         → Backend
Registrar cambios de estado → Backend
```

React se encarga principalmente de:

```text
Interfaz
Navegación
Estado visual
Validaciones de formulario
Consumo de API
Presentación de errores
Experiencia del usuario
```

---

# Pruebas

Los tests se encuentran principalmente en archivos:

```text
src/**/*.test.ts
src/**/*.test.tsx
```

Para ejecutarlos:

```bash
npm run test:run
```

Antes de una entrega se recomienda ejecutar:

```bash
npm run test:run
npm run build
npm run lint
```

---
## Proyecto académico

**Materia:** Programación Aplicada  
**Proyecto:** PA-08 FitClub  
**Frontend:** React + TypeScript  
**Backend:** Java 21 + Spring Boot  
**Base de datos:** PostgreSQL