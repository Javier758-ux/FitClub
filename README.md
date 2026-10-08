# FitClub

**PA-08 — Membresías, Clases y Reservas de Centro Deportivo**  
**Asignatura:** Programación Aplicada | **Gestión:** 2026-2

## Descripción del proyecto

FitClub es un sistema de gestión para un gimnasio o centro deportivo. Su objetivo es organizar la información de los socios, los planes y membresías, los instructores, las clases y sus horarios, las reservas, el control de asistencia y las notificaciones.

El proyecto se desarrolla de manera incremental, aplicando programación orientada a objetos, persistencia relacional y buenas prácticas de diseño. La arquitectura objetivo de la materia es un **monolito modular con arquitectura hexagonal simplificada**.

## Integrantes del equipo

- Javier Caye
- Cristhian Arze
- Ricardo Mendoza
- Leonardo Aguilera
- Joshua Villagomez

## Funcionalidades del sistema

El alcance previsto de FitClub comprende:

- Gestión de socios y sus datos.
- Administración de planes y membresías.
- Registro de instructores.
- Organización de clases y horarios.
- Reservas de clases y control de cupos.
- Registro y consulta de asistencia.
- Notificaciones relacionadas con las actividades y membresías.

> La implementación y disponibilidad de cada funcionalidad debe comprobarse en el código de la versión publicada en este repositorio.

## Tecnologías

| Tecnología | Uso en el proyecto |
|---|---|
| **Java 21** | Lenguaje del backend y modelo de dominio |
| **Maven** | Gestión de dependencias y construcción del proyecto Java |
| **PostgreSQL** | Base de datos relacional (identificada en la documentación del equipo como `fitclubsc`) |
| **Spring Boot** | Framework previsto para la API y los casos de uso del backend |
| **Git y GitHub** | Control de versiones y colaboración del equipo |
| **IntelliJ IDEA** | Desarrollo del backend |
| **DataGrip** | Consulta y administración de PostgreSQL |

Como parte del alcance académico general se contempla también React + TypeScript, React Native + TypeScript, Docker y GitHub Actions. Su presencia efectiva debe verificarse en los archivos del repositorio.

## Módulos del dominio

| Módulo | Elementos principales |
|---|---|
| `socio` | Socio, notificaciones y gestión de socios |
| `plan` | Plan, membresía e historial de membresía |
| `clase` | Clase, instructor, horario de clase, reserva y asistencia |

La organización de paquetes puede evolucionar durante el curso para separar **dominio, aplicación e infraestructura**.

## Organización del repositorio

La documentación inicial del equipo contempla la siguiente organización de referencia:

```text
FitClub/
├── backend/             # Proyecto Java y código del backend
├── Pasos y guías/        # Instrucciones de Git, GitHub, DataGrip e IntelliJ
├── documentosclases/    # Material de estudio de la asignatura
├── docs/                 # Visión, requisitos y decisiones técnicas
└── README.md             # Presentación general del proyecto
```

> Esta estructura es una referencia basada en el README proporcionado. Se ajustará para que coincida exactamente con las carpetas que se incorporen al repositorio.

## Avance documentado

El README anterior del equipo registra:

- **Capítulo 01:** desarrollo del modelo de dominio en Java, con entidades, atributos privados, constructores y encapsulamiento.
- **Capítulo 02:** uso de `enum`, contratos mediante interfaces, implementaciones de repositorio en memoria, servicios y excepciones propias.
- **Etapas posteriores:** incorporación progresiva de Spring Boot, conexión con PostgreSQL, API REST y demás componentes del proyecto.

**Nota:** estos puntos describen el avance registrado en el documento original; no constituyen una verificación de la versión actual del código.

## Guía para integrantes

1. Clonar el repositorio desde GitHub.
2. Abrir la carpeta del backend en IntelliJ IDEA.
3. Revisar el `README.md`, la documentación y la configuración necesaria del proyecto.
4. Configurar PostgreSQL localmente según las instrucciones compartidas por el equipo.
5. Trabajar con commits claros y sincronizar los cambios mediante Git.

### Clonar el repositorio

```bash
git clone https://github.com/Javier758-ux/FitClub.git
```

### Guardar y publicar cambios

```bash
git status
git add .
git commit -m "Describe el cambio realizado"
git push
```

**Seguridad:** no subir contraseñas de PostgreSQL, tokens, archivos `.env` reales ni otros datos sensibles. Antes de usar `git add .`, verificar que el `.gitignore` esté correctamente configurado.

## Objetivo académico

Construir y explicar un sistema funcional, mantenible y organizado, aplicando los contenidos de Programación Aplicada 2026-2 y registrando el trabajo colaborativo mediante GitHub.
