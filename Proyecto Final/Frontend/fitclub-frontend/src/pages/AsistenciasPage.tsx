import {
    useEffect,
    useMemo,
    useState
} from "react";

import {
    useAuth
} from "../auth/AuthContext";

import AsistenciaForm
    from "../components/AsistenciaForm";

import AsistenciaTable
    from "../components/AsistenciaTable";

import ParticipantesAsistencia
    from "../components/ParticipantesAsistencia";

import {
    EmptyState
} from "../components/ui/EmptyState";

import {
    Pagination
} from "../components/ui/Pagination";

import {
    SearchInput
} from "../components/ui/SearchInput";

import {
    SelectFilter
} from "../components/ui/SelectFilter";

import {
    asistenciaService
} from "../services/asistenciaService";

import {
    claseService
} from "../services/claseService";

import {
    horarioService
} from "../services/horarioService";

import {
    reservaService
} from "../services/reservaService";

import {
    socioService
} from "../services/socioService";

import type {
    AsistenciaApi,
    AsistenciaRequest,
    ClaseApi,
    HorarioApi,
    ReservaApi,
    SocioApi
} from "../models/ApiModels";

import "./FitclubTables.css";
import "./Asistencias.css";

function fechaLocalISO(): string {

    const ahora =
        new Date();

    const local =
        new Date(
            ahora.getTime() -
            ahora.getTimezoneOffset() *
            60_000
        );

    return local
        .toISOString()
        .slice(
            0,
            10
        );
}

export default function AsistenciasPage() {

    const {
        usuario
    } = useAuth();

    const [
        asistencias,
        setAsistencias
    ] =
        useState<AsistenciaApi[]>(
            []
        );

    const [
        reservas,
        setReservas
    ] =
        useState<ReservaApi[]>(
            []
        );

    const [
        socios,
        setSocios
    ] =
        useState<SocioApi[]>(
            []
        );

    const [
        horarios,
        setHorarios
    ] =
        useState<HorarioApi[]>(
            []
        );

    const [
        clases,
        setClases
    ] =
        useState<ClaseApi[]>(
            []
        );

    const [
        cargando,
        setCargando
    ] =
        useState(true);

    const [
        mostrarFormulario,
        setMostrarFormulario
    ] =
        useState(false);

    /*
     * Datos específicos de la vista
     * del INSTRUCTOR.
     */
    const [
        fechaInstructor,
        setFechaInstructor
    ] =
        useState(
            fechaLocalISO()
        );

    const [
        horariosInstructor,
        setHorariosInstructor
    ] =
        useState<HorarioApi[]>(
            []
        );

    const [
        horarioSeleccionado,
        setHorarioSeleccionado
    ] =
        useState("");

    const [
        participantes,
        setParticipantes
    ] =
        useState<ReservaApi[]>(
            []
        );

    const [
        cargandoParticipantes,
        setCargandoParticipantes
    ] =
        useState(false);

    const [
        procesandoReservaId,
        setProcesandoReservaId
    ] =
        useState<number | null>(
            null
        );

    /*
     * El backend actual permite al
     * instructor registrar asistencia,
     * pero no dispone de un GET de
     * sus asistencias registradas.
     *
     * Por eso mantenemos temporalmente
     * los registros hechos durante
     * la sesión actual.
     */
    const [
        registrosLocales,
        setRegistrosLocales
    ] =
        useState<
            Map<number, AsistenciaApi>
        >(
            () =>
                new Map()
        );

    const [
        search,
        setSearch
    ] =
        useState("");

    const [
        filtroResultado,
        setFiltroResultado
    ] =
        useState<
            "" |
            "PRESENTE" |
            "AUSENTE"
        >("");

    const [
        page,
        setPage
    ] =
        useState(1);

    const [
        pageSize,
        setPageSize
    ] =
        useState(10);

    const [
        error,
        setError
    ] =
        useState("");

    const [
        mensaje,
        setMensaje
    ] =
        useState("");

    /*
     * El usuario ya viene de AuthContext.
     *
     * Ya NO llamamos nuevamente:
     *
     * GET /api/auth/me
     *
     * desde esta página.
     */
    useEffect(() => {

        if (!usuario) {
            return;
        }

        const rol =
            usuario.rol;

        let activo =
            true;

        const controller =
            new AbortController();

        async function cargarInicial() {

            try {

                setCargando(
                    true
                );

                setError("");

                /*
                 * INSTRUCTOR:
                 *
                 * solamente necesitamos
                 * el catálogo de clases.
                 *
                 * Sus horarios se cargan
                 * posteriormente según
                 * la fecha seleccionada.
                 */
                if (
                    rol ===
                    "INSTRUCTOR"
                ) {

                    const paginaClases =
                        await claseService
                            .listar(
                                0,
                                100,
                                controller.signal
                            );

                    if (activo) {

                        setClases(
                            paginaClases.contenido
                        );
                    }

                    return;
                }

                /*
                 * ADMINISTRADOR / RECEPCION:
                 *
                 * pueden consultar todas las
                 * asistencias y necesitan
                 * resolver:
                 *
                 * asistencia
                 * → reserva
                 * → socio
                 * → horario
                 * → clase
                 */
                if (
                    rol ===
                    "ADMINISTRADOR" ||
                    rol ===
                    "RECEPCION"
                ) {

                    const [
                        listaAsistencias,
                        listaReservas,
                        listaHorarios,
                        paginaClases,
                        paginaSocios
                    ] =
                        await Promise.all([

                            asistenciaService
                                .listar(
                                    controller.signal
                                ),

                            reservaService
                                .listar(
                                    controller.signal
                                ),

                            horarioService
                                .listar(
                                    controller.signal
                                ),

                            claseService
                                .listar(
                                    0,
                                    100,
                                    controller.signal
                                ),

                            socioService
                                .listar(
                                    0,
                                    100,
                                    controller.signal
                                )

                        ]);

                    if (activo) {

                        setAsistencias(
                            listaAsistencias
                        );

                        setReservas(
                            listaReservas
                        );

                        setHorarios(
                            listaHorarios
                        );

                        setClases(
                            paginaClases.contenido
                        );

                        setSocios(
                            paginaSocios.contenido
                        );
                    }
                }

            } catch (err) {

                if (activo) {

                    setError(
                        err instanceof Error
                            ? err.message
                            : "No se pudo cargar el módulo de asistencias."
                    );
                }

            } finally {

                if (activo) {

                    setCargando(
                        false
                    );
                }
            }
        }

        void cargarInicial();

        return () => {

            activo = false;

            controller.abort();
        };

    }, [usuario]);

    /*
     * INSTRUCTOR:
     *
     * cada vez que cambia la fecha,
     * consultamos únicamente los horarios
     * asignados al instructor autenticado.
     */
    useEffect(() => {

        if (
            usuario?.rol !==
            "INSTRUCTOR"
        ) {
            return;
        }

        const controller =
            new AbortController();

        let activo =
            true;

        async function cargarHorariosDelDia() {

            try {

                setError("");

                setHorarioSeleccionado(
                    ""
                );

                setParticipantes(
                    []
                );

                setRegistrosLocales(
                    new Map()
                );

                const lista =
                    await horarioService
                        .listarMios(
                            fechaInstructor,
                            controller.signal
                        );

                if (activo) {

                    setHorariosInstructor(
                        lista
                    );
                }

            } catch (err) {

                if (activo) {

                    setError(
                        err instanceof Error
                            ? err.message
                            : "No se pudieron cargar tus horarios."
                    );
                }
            }
        }

        void cargarHorariosDelDia();

        return () => {

            activo = false;

            controller.abort();
        };

    }, [
        fechaInstructor,
        usuario?.rol
    ]);

    /*
     * Volver a página 1 cuando
     * cambia algún filtro.
     */
    useEffect(() => {

        setPage(1);

    }, [
        search,
        filtroResultado,
        pageSize
    ]);

    /*
     * Ocultar mensajes de éxito
     * automáticamente.
     */
    useEffect(() => {

        if (!mensaje) {
            return;
        }

        const timer =
            window.setTimeout(
                () =>
                    setMensaje(""),
                2500
            );

        return () =>
            window.clearTimeout(
                timer
            );

    }, [mensaje]);

    const reservasPorId =
        useMemo(
            () =>
                new Map(
                    reservas.map(
                        (reserva) => [
                            reserva.id,
                            reserva
                        ]
                    )
                ),
            [reservas]
        );

    const sociosPorId =
        useMemo(
            () =>
                new Map(
                    socios.map(
                        (socio) => [
                            socio.id,
                            socio
                        ]
                    )
                ),
            [socios]
        );

    const horariosPorId =
        useMemo(
            () =>
                new Map(
                    horarios.map(
                        (horario) => [
                            horario.id,
                            horario
                        ]
                    )
                ),
            [horarios]
        );

    const clasesPorId =
        useMemo(
            () =>
                new Map(
                    clases.map(
                        (clase) => [
                            clase.id,
                            clase
                        ]
                    )
                ),
            [clases]
        );

    const asistenciasFiltradas =
        useMemo(() => {

            const term =
                search
                    .trim()
                    .toLowerCase();

            return asistencias.filter(
                (asistencia) => {

                    const reserva =
                        reservasPorId.get(
                            asistencia.reservaClaseId
                        );

                    const socio =
                        reserva
                            ? sociosPorId.get(
                                reserva.socioId
                            )
                            : undefined;

                    const horario =
                        reserva
                            ? horariosPorId.get(
                                reserva.horarioClaseId
                            )
                            : undefined;

                    const clase =
                        horario
                            ? clasesPorId.get(
                                horario.claseId
                            )
                            : undefined;

                    const texto = [

                        asistencia.id,

                        socio?.nombre ??
                        "",

                        socio?.email ??
                        "",

                        clase?.nombre ??
                        "",

                        horario?.fecha ??
                        "",

                        asistencia.presente
                            ? "presente"
                            : "ausente"

                    ]
                        .join(" ")
                        .toLowerCase();

                    const coincideTexto =
                        !term ||
                        texto.includes(
                            term
                        );

                    const coincideResultado =
                        !filtroResultado ||
                        (
                            filtroResultado ===
                            "PRESENTE"
                                ? asistencia.presente
                                : !asistencia.presente
                        );

                    return (
                        coincideTexto &&
                        coincideResultado
                    );
                }
            );

        }, [
            asistencias,
            search,
            filtroResultado,
            reservasPorId,
            sociosPorId,
            horariosPorId,
            clasesPorId
        ]);

    const totalPages =
        Math.max(
            1,
            Math.ceil(
                asistenciasFiltradas.length /
                pageSize
            )
        );

    useEffect(() => {

        if (
            page >
            totalPages
        ) {

            setPage(
                totalPages
            );
        }

    }, [
        page,
        totalPages
    ]);

    const asistenciasVisibles =
        useMemo(() => {

            const inicio =
                (page - 1) *
                pageSize;

            return asistenciasFiltradas
                .slice(
                    inicio,
                    inicio + pageSize
                );

        }, [
            asistenciasFiltradas,
            page,
            pageSize
        ]);

    /*
     * ADMINISTRADOR / RECEPCION
     *
     * Registro general de asistencia.
     */
    async function guardarAsistencia(
        datos:
        AsistenciaRequest
    ) {

        const creada =
            await asistenciaService
                .registrar(
                    datos
                );

        setAsistencias(
            (actuales) => [
                creada,
                ...actuales
            ]
        );

        setMostrarFormulario(
            false
        );

        setMensaje(
            "Asistencia registrada correctamente."
        );

        setError("");
    }

    /*
     * INSTRUCTOR
     *
     * Al seleccionar uno de sus horarios,
     * cargamos solamente las reservas
     * activas correspondientes a esa clase.
     */
    async function seleccionarHorario(
        horarioId: string
    ) {

        setHorarioSeleccionado(
            horarioId
        );

        setParticipantes(
            []
        );

        setRegistrosLocales(
            new Map()
        );

        setError("");
        setMensaje("");

        if (!horarioId) {
            return;
        }

        setCargandoParticipantes(
            true
        );

        try {

            const lista =
                await reservaService
                    .participantesDeMiClase(
                        Number(
                            horarioId
                        )
                    );

            setParticipantes(
                lista
            );

        } catch (err) {

            setError(
                err instanceof Error
                    ? err.message
                    : "No se pudieron cargar los participantes."
            );

        } finally {

            setCargandoParticipantes(
                false
            );
        }
    }

    /*
     * INSTRUCTOR
     *
     * Registra Presente/Ausente
     * utilizando el endpoint protegido
     * de sus propias clases.
     */
    async function registrarPorInstructor(
        reserva: ReservaApi,
        presente: boolean
    ) {

        if (
            procesandoReservaId !==
            null
        ) {
            return;
        }

        setProcesandoReservaId(
            reserva.id
        );

        setError("");
        setMensaje("");

        try {

            const creada =
                await asistenciaService
                    .registrarMiClase({

                        reservaClaseId:
                        reserva.id,

                        presente

                    });

            setRegistrosLocales(
                (actuales) => {

                    const siguiente =
                        new Map(
                            actuales
                        );

                    siguiente.set(
                        reserva.id,
                        creada
                    );

                    return siguiente;
                }
            );

            setMensaje(
                presente
                    ? "Asistencia marcada como presente."
                    : "Asistencia marcada como ausente."
            );

        } catch (err) {

            setError(
                err instanceof Error
                    ? err.message
                    : "No se pudo registrar la asistencia."
            );

        } finally {

            setProcesandoReservaId(
                null
            );
        }
    }

    if (cargando) {

        return (
            <section className="asistencias-page">

                <h1>
                    Control de Asistencia
                </h1>

                <p>
                    Cargando información...
                </p>

            </section>
        );
    }

    /*
     * Esta vista normalmente no será
     * alcanzada porque ProtectedRoute
     * ya bloquea al SOCIO.
     *
     * La dejamos igualmente como
     * protección visual adicional.
     */
    if (
        usuario?.rol ===
        "SOCIO"
    ) {

        return (
            <section className="asistencias-page">

                <h1>
                    Control de Asistencia
                </h1>

                <EmptyState
                    title="Módulo operativo"
                    description={
                        "El registro de asistencia corresponde a Recepción, Administración e Instructores."
                    }
                />

            </section>
        );
    }

    /*
     * ============================
     * VISTA DEL INSTRUCTOR
     * ============================
     */
    if (
        usuario?.rol ===
        "INSTRUCTOR"
    ) {

        const clasesMap =
            new Map(
                clases.map(
                    (clase) => [
                        clase.id,
                        clase
                    ]
                )
            );

        return (
            <section className="asistencias-page">

                <header className="asistencias-header">

                    <div>

                        <h1>
                            Asistencia de mis clases
                        </h1>

                        <p>
                            Selecciona una fecha
                            y uno de tus horarios
                            para registrar la
                            asistencia de sus
                            participantes.
                        </p>

                    </div>

                </header>

                {mensaje && (

                    <div
                        className="asistencias-success"
                        role="status"
                    >
                        {mensaje}
                    </div>

                )}

                {error && (

                    <div
                        className="asistencias-error"
                        role="alert"
                    >
                        {error}
                    </div>

                )}

                <section className="asistencias-instructor-panel">

                    <div className="ui-field">

                        <label
                            className="ui-field__label"
                            htmlFor="asistencia-fecha"
                        >
                            Fecha
                        </label>

                        <input
                            id="asistencia-fecha"
                            type="date"
                            value={
                                fechaInstructor
                            }
                            onChange={(e) =>
                                setFechaInstructor(
                                    e.target.value
                                )
                            }
                        />

                    </div>

                    <div className="ui-field">

                        <label
                            className="ui-field__label"
                            htmlFor="asistencia-horario"
                        >
                            Mi horario
                        </label>

                        <select
                            id="asistencia-horario"
                            value={
                                horarioSeleccionado
                            }
                            onChange={(e) =>
                                void seleccionarHorario(
                                    e.target.value
                                )
                            }
                        >

                            <option value="">
                                Seleccionar horario
                            </option>

                            {horariosInstructor.map(
                                (horario) => {

                                    const clase =
                                        clasesMap.get(
                                            horario.claseId
                                        );

                                    return (
                                        <option
                                            key={
                                                horario.id
                                            }
                                            value={
                                                String(
                                                    horario.id
                                                )
                                            }
                                        >

                                            {
                                                clase?.nombre ??
                                                `Clase #${horario.claseId}`
                                            }

                                            {" — "}

                                            {
                                                horario.horaInicio.slice(
                                                    0,
                                                    5
                                                )
                                            }

                                            {" a "}

                                            {
                                                horario.horaFin.slice(
                                                    0,
                                                    5
                                                )
                                            }

                                        </option>
                                    );
                                }
                            )}

                        </select>

                    </div>

                </section>

                {
                    horariosInstructor.length ===
                    0 && (

                        <EmptyState
                            title="No tienes clases en esta fecha"
                            description={
                                "Selecciona otra fecha para consultar tu calendario."
                            }
                        />

                    )
                }

                {cargandoParticipantes ? (

                    <p>
                        Cargando participantes...
                    </p>

                ) : (
                    horarioSeleccionado &&
                    participantes.length === 0
                ) ? (

                    <EmptyState
                        title="No hay reservas activas"
                        description={
                            "Este horario todavía no tiene participantes con reserva activa."
                        }
                    />

                ) : (
                    participantes.length > 0
                ) ? (

                    <ParticipantesAsistencia
                        participantes={
                            participantes
                        }
                        registrosLocales={
                            registrosLocales
                        }
                        procesandoReservaId={
                            procesandoReservaId
                        }
                        onRegistrar={
                            (
                                reserva,
                                presente
                            ) =>
                                void registrarPorInstructor(
                                    reserva,
                                    presente
                                )
                        }
                    />

                ) : null}

                <div className="asistencias-warning">

                    El backend actual permite al
                    instructor registrar asistencia,
                    pero todavía no dispone de un
                    endpoint GET específico para
                    recuperar posteriormente todas
                    sus asistencias registradas.

                    Por eso los estados registrados
                    durante esta pantalla se conservan
                    temporalmente en React.

                </div>

                <p className="asistencias-note">

                    La lista de participantes
                    devuelve actualmente el ID del
                    socio.

                    El rol INSTRUCTOR no puede
                    consultar directamente el
                    catálogo administrativo de
                    socios, por lo que se muestra
                    “Socio #ID”.

                </p>

            </section>
        );
    }

    /*
     * ============================
     * ADMINISTRADOR / RECEPCION
     * ============================
     */
    return (
        <section className="asistencias-page">

            <header className="asistencias-header">

                <div>

                    <h1>
                        Control de Asistencia
                    </h1>

                    <p>
                        Consulta y registra
                        la asistencia de las
                        reservas de FitClub.
                    </p>

                </div>

                <div className="asistencias-actions">

                    <button
                        type="button"
                        className="btn-primary"
                        onClick={() =>
                            setMostrarFormulario(
                                (actual) =>
                                    !actual
                            )
                        }
                    >

                        {mostrarFormulario
                            ? "Cerrar formulario"
                            : "+ Registrar asistencia"}

                    </button>

                </div>

            </header>

            {mensaje && (

                <div
                    className="asistencias-success"
                    role="status"
                >
                    {mensaje}
                </div>

            )}

            {error && (

                <div
                    className="asistencias-error"
                    role="alert"
                >
                    {error}
                </div>

            )}

            {mostrarFormulario && (

                <AsistenciaForm
                    reservas={
                        reservas
                    }
                    asistencias={
                        asistencias
                    }
                    socios={
                        socios
                    }
                    horarios={
                        horarios
                    }
                    clases={
                        clases
                    }
                    onGuardar={
                        guardarAsistencia
                    }
                    onCancelar={() =>
                        setMostrarFormulario(
                            false
                        )
                    }
                />

            )}

            <section className="filter-panel">

                <div className="filter-panel__grid">

                    <SearchInput
                        label="Buscar asistencia"
                        value={
                            search
                        }
                        placeholder={
                            "Socio, clase, fecha o resultado"
                        }
                        onChange={
                            setSearch
                        }
                    />

                    <SelectFilter
                        label="Resultado"
                        value={
                            filtroResultado
                        }
                        options={[
                            {
                                value: "",
                                label: "Todos"
                            },
                            {
                                value:
                                    "PRESENTE",
                                label:
                                    "PRESENTE"
                            },
                            {
                                value:
                                    "AUSENTE",
                                label:
                                    "AUSENTE"
                            }
                        ]}
                        onChange={
                            (value) =>
                                setFiltroResultado(
                                    value as
                                        "" |
                                        "PRESENTE" |
                                        "AUSENTE"
                                )
                        }
                    />

                    <SelectFilter
                        label="Registros por página"
                        value={
                            String(
                                pageSize
                            )
                        }
                        options={[
                            {
                                value: "5",
                                label: "5"
                            },
                            {
                                value: "10",
                                label: "10"
                            },
                            {
                                value: "20",
                                label: "20"
                            }
                        ]}
                        onChange={
                            (value) =>
                                setPageSize(
                                    Number(
                                        value
                                    )
                                )
                        }
                    />

                </div>

            </section>

            <p className="results-summary">

                Mostrando{" "}
                {
                    asistenciasVisibles.length
                }
                {" "}de{" "}
                {
                    asistenciasFiltradas.length
                }
                {" "}resultado(s).

            </p>

            {
                asistenciasFiltradas.length ===
                0
                    ? (

                        <EmptyState
                            title="No hay asistencias"
                            description={
                                "No existen registros que coincidan con los filtros seleccionados."
                            }
                        />

                    )
                    : (

                        <>

                            <AsistenciaTable
                                asistencias={
                                    asistenciasVisibles
                                }
                                reservas={
                                    reservas
                                }
                                socios={
                                    socios
                                }
                                horarios={
                                    horarios
                                }
                                clases={
                                    clases
                                }
                            />

                            <Pagination
                                page={
                                    page
                                }
                                totalPages={
                                    totalPages
                                }
                                onPageChange={
                                    setPage
                                }
                            />

                        </>

                    )
            }

        </section>
    );
}