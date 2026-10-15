import {
    useEffect,
    useMemo,
    useState
} from "react";

import NotificacionForm
    from "../components/NotificacionForm";

import NotificacionTable
    from "../components/NotificacionTable";

import {
    Button
} from "../components/ui/Button";

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
    authService
} from "../services/authService";

import type {
    UsuarioActual
} from "../services/authService";

import {
    notificacionService
} from "../services/notificacionService";

import {
    socioService
} from "../services/socioService";

import type {
    NotificacionApi,
    NotificacionRequest,
    SocioApi
} from "../models/ApiModels";

import "./FitclubTables.css";
import "./Notificaciones.css";

type FiltroLectura =
    | ""
    | "LEIDA"
    | "NO_LEIDA";

export default function NotificacionesPage() {

    const [
        usuario,
        setUsuario
    ] =
        useState<UsuarioActual | null>(
            null
        );

    const [
        notificaciones,
        setNotificaciones
    ] =
        useState<NotificacionApi[]>(
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
        cargando,
        setCargando
    ] =
        useState(true);

    const [
        recargando,
        setRecargando
    ] =
        useState(false);

    const [
        procesandoId,
        setProcesandoId
    ] =
        useState<number | null>(
            null
        );

    const [
        mostrarFormulario,
        setMostrarFormulario
    ] =
        useState(false);

    const [
        search,
        setSearch
    ] =
        useState("");

    const [
        filtroLectura,
        setFiltroLectura
    ] =
        useState<FiltroLectura>(
            ""
        );

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

    useEffect(() => {

        let activo =
            true;

        const controller =
            new AbortController();

        async function cargarInicial() {

            try {

                setCargando(true);
                setError("");

                const usuarioActual =
                    await authService
                        .obtenerUsuarioActual();

                if (!activo) {
                    return;
                }

                setUsuario(
                    usuarioActual
                );

                /*
                 * SOCIO:
                 * solo consulta sus propias
                 * notificaciones.
                 */
                if (
                    usuarioActual.rol ===
                    "SOCIO"
                ) {

                    const lista =
                        await notificacionService
                            .listarMias(
                                controller.signal
                            );

                    if (activo) {

                        setNotificaciones(
                            lista
                        );
                    }

                    return;
                }

                /*
                 * ADMINISTRADOR / RECEPCION:
                 * consulta todas y carga
                 * los socios para mostrar
                 * sus nombres.
                 */
                if (
                    usuarioActual.rol ===
                    "ADMINISTRADOR" ||
                    usuarioActual.rol ===
                    "RECEPCION"
                ) {

                    const [
                        lista,
                        paginaSocios
                    ] =
                        await Promise.all([

                            notificacionService
                                .listar(
                                    undefined,
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

                        setNotificaciones(
                            lista
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
                            : "No se pudo cargar el módulo de notificaciones."
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

    }, []);

    useEffect(() => {

        setPage(1);

    }, [
        search,
        filtroLectura,
        pageSize
    ]);

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

    const notificacionesFiltradas =
        useMemo(() => {

            const term =
                search
                    .trim()
                    .toLowerCase();

            return notificaciones.filter(
                (notificacion) => {

                    const socio =
                        sociosPorId.get(
                            notificacion.socioId
                        );

                    const texto = [

                        notificacion.id,

                        notificacion.titulo,

                        notificacion.mensaje,

                        socio?.nombre ??
                        "",

                        socio?.email ??
                        "",

                        notificacion.leida
                            ? "leida"
                            : "no leida"

                    ]
                        .join(" ")
                        .toLowerCase();

                    const coincideTexto =
                        !term ||
                        texto.includes(
                            term
                        );

                    const coincideLectura =
                        !filtroLectura ||
                        (
                            filtroLectura ===
                            "LEIDA"
                                ? notificacion.leida
                                : !notificacion.leida
                        );

                    return (
                        coincideTexto &&
                        coincideLectura
                    );
                }
            );

        }, [
            notificaciones,
            search,
            filtroLectura,
            sociosPorId
        ]);

    const totalPages =
        Math.max(
            1,
            Math.ceil(
                notificacionesFiltradas.length /
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

    const notificacionesVisibles =
        useMemo(() => {

            const inicio =
                (page - 1) *
                pageSize;

            return notificacionesFiltradas
                .slice(
                    inicio,
                    inicio + pageSize
                );

        }, [
            notificacionesFiltradas,
            page,
            pageSize
        ]);

    const noLeidas =
        useMemo(
            () =>
                notificaciones.filter(
                    (notificacion) =>
                        !notificacion.leida
                ).length,

            [notificaciones]
        );

    const esSocio =
        usuario?.rol ===
        "SOCIO";

    const esOperador =
        usuario?.rol ===
        "ADMINISTRADOR" ||
        usuario?.rol ===
        "RECEPCION";

    async function guardarNotificacion(
        datos:
        NotificacionRequest
    ) {

        const creada =
            await notificacionService
                .crear(
                    datos
                );

        setNotificaciones(
            (actuales) => [
                creada,
                ...actuales
            ]
        );

        setMostrarFormulario(
            false
        );

        setMensaje(
            "Notificación enviada correctamente."
        );

        setError("");
    }

    async function marcarComoLeida(
        notificacion:
        NotificacionApi
    ) {

        if (
            notificacion.leida ||
            procesandoId !== null
        ) {
            return;
        }

        setProcesandoId(
            notificacion.id
        );

        setError("");
        setMensaje("");

        try {

            const actualizada =
                esSocio
                    ? await notificacionService
                        .marcarPropiaComoLeida(
                            notificacion.id
                        )
                    : await notificacionService
                        .marcarComoLeida(
                            notificacion.id
                        );

            setNotificaciones(
                (actuales) =>
                    actuales.map(
                        (item) =>
                            item.id ===
                            actualizada.id
                                ? actualizada
                                : item
                    )
            );

            setMensaje(
                "Notificación marcada como leída."
            );

        } catch (err) {

            setError(
                err instanceof Error
                    ? err.message
                    : "No se pudo marcar la notificación como leída."
            );

        } finally {

            setProcesandoId(
                null
            );

        }
    }

    async function recargarNotificaciones() {

        if (
            !usuario ||
            recargando
        ) {
            return;
        }

        setRecargando(true);
        setError("");
        setMensaje("");

        try {

            if (
                usuario.rol ===
                "SOCIO"
            ) {

                setNotificaciones(
                    await notificacionService
                        .listarMias()
                );

            } else if (
                usuario.rol ===
                "ADMINISTRADOR" ||
                usuario.rol ===
                "RECEPCION"
            ) {

                setNotificaciones(
                    await notificacionService
                        .listar()
                );
            }

            setMensaje(
                "Notificaciones actualizadas."
            );

        } catch (err) {

            setError(
                err instanceof Error
                    ? err.message
                    : "No se pudieron actualizar las notificaciones."
            );

        } finally {

            setRecargando(false);

        }
    }

    if (cargando) {

        return (
            <section className="notificaciones-page">

                <h1>
                    Notificaciones
                </h1>

                <p>
                    Cargando notificaciones...
                </p>

            </section>
        );
    }

    /*
     * El backend actual no autoriza
     * ningún endpoint de notificaciones
     * para INSTRUCTOR.
     */
    if (
        usuario?.rol ===
        "INSTRUCTOR"
    ) {

        return (
            <section className="notificaciones-page">

                <h1>
                    Notificaciones
                </h1>

                <EmptyState
                    title="Notificaciones no disponibles para Instructor"
                    description={
                        "El backend actual no expone un endpoint de notificaciones para el rol INSTRUCTOR."
                    }
                />

            </section>
        );
    }

    return (
        <section className="notificaciones-page">

            <header className="notificaciones-header">

                <div>

                    <h1>
                        {esSocio
                            ? "Mis Notificaciones"
                            : "Gestión de Notificaciones"}
                    </h1>

                    <p>
                        {esSocio
                            ? "Consulta tus avisos y marca los que ya revisaste."
                            : "Envía y administra las notificaciones de los socios."}
                    </p>

                    {usuario && (

                        <span className="notificaciones-role">

                            Sesión:{" "}
                            {usuario.nombre}
                            {" — "}
                            {usuario.rol}

                        </span>

                    )}

                </div>

                <div className="notificaciones-actions">

                    <Button
                        type="button"
                        variant="secondary"
                        loading={
                            recargando
                        }
                        onClick={() =>
                            void recargarNotificaciones()
                        }
                    >
                        Actualizar lista
                    </Button>

                    {esOperador && (

                        <Button
                            type="button"
                            onClick={() =>
                                setMostrarFormulario(
                                    (actual) =>
                                        !actual
                                )
                            }
                        >

                            {mostrarFormulario
                                ? "Cerrar formulario"
                                : "+ Nueva notificación"}

                        </Button>

                    )}

                </div>

            </header>

            {mensaje && (

                <div
                    className="notificaciones-success"
                    role="status"
                >
                    {mensaje}
                </div>

            )}

            {error && (

                <div
                    className="notificaciones-error"
                    role="alert"
                >
                    {error}
                </div>

            )}

            {
                mostrarFormulario &&
                esOperador && (

                    <NotificacionForm
                        socios={
                            socios
                        }
                        onGuardar={
                            guardarNotificacion
                        }
                        onCancelar={() =>
                            setMostrarFormulario(
                                false
                            )
                        }
                    />

                )
            }

            <div className="notificaciones-summary">

                <span>
                    Total:{" "}
                    {notificaciones.length}
                </span>

                <span>
                    No leídas:{" "}
                    {noLeidas}
                </span>

                <span>
                    Leídas:{" "}
                    {
                        notificaciones.length -
                        noLeidas
                    }
                </span>

            </div>

            <section className="filter-panel">

                <div className="filter-panel__grid">

                    <SearchInput
                        label="Buscar notificación"
                        value={
                            search
                        }
                        placeholder={
                            esSocio
                                ? "Título o mensaje"
                                : "Socio, título o mensaje"
                        }
                        onChange={
                            setSearch
                        }
                    />

                    <SelectFilter
                        label="Estado de lectura"
                        value={
                            filtroLectura
                        }
                        options={[
                            {
                                value: "",
                                label:
                                    "Todas"
                            },
                            {
                                value:
                                    "NO_LEIDA",
                                label:
                                    "No leídas"
                            },
                            {
                                value:
                                    "LEIDA",
                                label:
                                    "Leídas"
                            }
                        ]}
                        onChange={
                            (value) =>
                                setFiltroLectura(
                                    value as
                                        FiltroLectura
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
                    notificacionesVisibles.length
                }
                {" "}de{" "}
                {
                    notificacionesFiltradas.length
                }
                {" "}resultado(s).

            </p>

            {
                notificacionesFiltradas.length ===
                0
                    ? (

                        <EmptyState
                            title="No hay notificaciones"
                            description={
                                esSocio
                                    ? "No tienes notificaciones que coincidan con los filtros."
                                    : "No existen notificaciones que coincidan con los filtros seleccionados."
                            }
                        />

                    )
                    : (

                        <>

                            <NotificacionTable
                                notificaciones={
                                    notificacionesVisibles
                                }
                                socios={
                                    socios
                                }
                                mostrarSocio={
                                    !esSocio
                                }
                                procesandoId={
                                    procesandoId
                                }
                                onMarcarLeida={
                                    (
                                        notificacion
                                    ) =>
                                        void marcarComoLeida(
                                            notificacion
                                        )
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