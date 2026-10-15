import {
    useEffect,
    useMemo,
    useState
} from "react";

import ReservaForm
    from "../components/ReservaForm";

import ReservaTable
    from "../components/ReservaTable";

import {
    Button
} from "../components/ui/Button";

import {
    ConfirmDialog
} from "../components/ui/ConfirmDialog";

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
    ClaseApi,
    EstadoReserva,
    HorarioApi,
    ReservaApi,
    SocioApi
} from "../models/ApiModels";

import "./FitclubTables.css";
import "./Reservas.css";

export default function ReservasPage() {

    const [
        usuario,
        setUsuario
    ] =
        useState<UsuarioActual | null>(
            null
        );

    const [
        reservas,
        setReservas
    ] =
        useState<ReservaApi[]>([]);

    const [
        horarios,
        setHorarios
    ] =
        useState<HorarioApi[]>([]);

    const [
        clases,
        setClases
    ] =
        useState<ClaseApi[]>([]);

    const [
        socios,
        setSocios
    ] =
        useState<SocioApi[]>([]);

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
        mostrarFormulario,
        setMostrarFormulario
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
        pendingCancel,
        setPendingCancel
    ] =
        useState<ReservaApi | null>(
            null
        );

    const [
        search,
        setSearch
    ] =
        useState("");

    const [
        estado,
        setEstado
    ] =
        useState<
            EstadoReserva | ""
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

    useEffect(() => {

        let activo = true;

        const controller =
            new AbortController();

        async function cargarInicial() {

            try {

                setCargando(true);
                setError("");

                const usuarioActual =
                    await authService
                        .obtenerUsuarioActual();

                const [
                    paginaClases,
                    listaHorarios
                ] =
                    await Promise.all([

                        claseService.listar(
                            0,
                            100,
                            controller.signal
                        ),

                        horarioService.listar(
                            controller.signal
                        )

                    ]);

                if (!activo) {
                    return;
                }

                setUsuario(
                    usuarioActual
                );

                setClases(
                    paginaClases.contenido
                );

                setHorarios(
                    listaHorarios
                );

                if (
                    usuarioActual.rol ===
                    "SOCIO"
                ) {

                    const lista =
                        await reservaService
                            .listarMias(
                                controller.signal
                            );

                    if (activo) {
                        setReservas(
                            lista
                        );
                    }

                    return;
                }

                if (
                    usuarioActual.rol ===
                    "ADMINISTRADOR" ||
                    usuarioActual.rol ===
                    "RECEPCION"
                ) {

                    const [
                        listaReservas,
                        paginaSocios
                    ] =
                        await Promise.all([

                            reservaService.listar(
                                controller.signal
                            ),

                            socioService.listar(
                                0,
                                100,
                                controller.signal
                            )

                        ]);

                    if (activo) {

                        setReservas(
                            listaReservas
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
                            : "No se pudo cargar el módulo de reservas."
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
        estado,
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

    const reservasFiltradas =
        useMemo(() => {

            const term =
                search
                    .trim()
                    .toLowerCase();

            return reservas.filter(
                (reserva) => {

                    const horario =
                        horariosPorId.get(
                            reserva.horarioClaseId
                        );

                    const clase =
                        horario
                            ? clasesPorId.get(
                                horario.claseId
                            )
                            : undefined;

                    const socio =
                        sociosPorId.get(
                            reserva.socioId
                        );

                    const texto = [

                        reserva.id,

                        socio?.nombre ??
                        "",

                        socio?.email ??
                        "",

                        clase?.nombre ??
                        "",

                        horario?.fecha ??
                        "",

                        reserva.estado

                    ]
                        .join(" ")
                        .toLowerCase();

                    const coincideTexto =
                        !term ||
                        texto.includes(
                            term
                        );

                    const coincideEstado =
                        !estado ||
                        reserva.estado ===
                        estado;

                    return (
                        coincideTexto &&
                        coincideEstado
                    );
                }
            );

        }, [
            reservas,
            search,
            estado,
            horariosPorId,
            clasesPorId,
            sociosPorId
        ]);

    const totalPages =
        Math.max(
            1,
            Math.ceil(
                reservasFiltradas.length /
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

    const reservasVisibles =
        useMemo(() => {

            const inicio =
                (page - 1) *
                pageSize;

            return reservasFiltradas
                .slice(
                    inicio,
                    inicio + pageSize
                );

        }, [
            reservasFiltradas,
            page,
            pageSize
        ]);

    const puedeReservar =
        usuario?.rol ===
        "SOCIO" ||
        usuario?.rol ===
        "ADMINISTRADOR" ||
        usuario?.rol ===
        "RECEPCION";

    const esSocio =
        usuario?.rol ===
        "SOCIO";

    async function guardarReserva(
        horarioClaseId: number,
        socioId?: number
    ) {

        let creada:
            ReservaApi;

        if (esSocio) {

            creada =
                await reservaService
                    .crearMia({
                        horarioClaseId
                    });

        } else {

            if (
                socioId === undefined
            ) {

                throw new Error(
                    "Debes seleccionar un socio."
                );
            }

            creada =
                await reservaService
                    .crear({
                        socioId,
                        horarioClaseId
                    });
        }

        setReservas(
            (actuales) => [
                creada,
                ...actuales
            ]
        );

        setMostrarFormulario(
            false
        );

        setMensaje(
            "Reserva registrada correctamente."
        );

        setError("");
    }

    async function confirmarCancelacion() {

        if (!pendingCancel) {
            return;
        }

        const reserva =
            pendingCancel;

        setProcesandoId(
            reserva.id
        );

        setError("");
        setMensaje("");

        try {

            const actualizada =
                esSocio
                    ? await reservaService
                        .cancelarMia(
                            reserva.id
                        )
                    : await reservaService
                        .cancelar(
                            reserva.id
                        );

            setReservas(
                (actuales) =>
                    actuales.map(
                        (item) =>
                            item.id ===
                            actualizada.id
                                ? actualizada
                                : item
                    )
            );

            setPendingCancel(
                null
            );

            setMensaje(
                "Reserva cancelada correctamente."
            );

        } catch (err) {

            setError(
                err instanceof Error
                    ? err.message
                    : "No se pudo cancelar la reserva."
            );

        } finally {

            setProcesandoId(
                null
            );

        }
    }

    async function recargarReservas() {

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

                setReservas(
                    await reservaService
                        .listarMias()
                );

            } else if (
                usuario.rol ===
                "ADMINISTRADOR" ||
                usuario.rol ===
                "RECEPCION"
            ) {

                setReservas(
                    await reservaService
                        .listar()
                );
            }

            setMensaje(
                "Reservas actualizadas."
            );

        } catch (err) {

            setError(
                err instanceof Error
                    ? err.message
                    : "No se pudieron actualizar las reservas."
            );

        } finally {

            setRecargando(
                false
            );

        }
    }

    if (cargando) {

        return (
            <section className="reservas-page">

                <h1>
                    Gestión de Reservas
                </h1>

                <p>
                    Cargando reservas...
                </p>

            </section>
        );
    }

    if (
        usuario?.rol ===
        "INSTRUCTOR"
    ) {

        return (
            <section className="reservas-page">

                <h1>
                    Reservas de mis clases
                </h1>

                <EmptyState
                    title={
                        "La lista de participantes se gestiona desde Asistencias"
                    }
                    description={
                        "En el siguiente módulo podrás seleccionar uno de tus horarios, ver sus reservas activas y registrar asistencia."
                    }
                />

            </section>
        );
    }

    return (
        <section className="reservas-page">

            <header className="reservas-header">

                <div>

                    <h1>
                        {esSocio
                            ? "Mis Reservas"
                            : "Gestión de Reservas"}
                    </h1>

                    <p>
                        {esSocio
                            ? "Consulta, reserva y cancela tus clases."
                            : "Administra las reservas de los socios de FitClub."}
                    </p>

                    {usuario && (

                        <span className="reservas-role">

                            Sesión:{" "}
                            {usuario.nombre}
                            {" — "}
                            {usuario.rol}

                        </span>

                    )}

                </div>

                <div className="reservas-actions">

                    <Button
                        type="button"
                        variant="secondary"
                        loading={
                            recargando
                        }
                        onClick={() =>
                            void recargarReservas()
                        }
                    >
                        Actualizar lista
                    </Button>

                    {puedeReservar && (

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
                                : "+ Nueva reserva"}

                        </Button>

                    )}

                </div>

            </header>

            {mensaje && (

                <div
                    className="reservas-success"
                    role="status"
                >
                    {mensaje}
                </div>

            )}

            {error && (

                <div
                    className="reservas-error"
                    role="alert"
                >
                    {error}
                </div>

            )}

            {mostrarFormulario && (

                <ReservaForm
                    modo={
                        esSocio
                            ? "PROPIA"
                            : "ADMINISTRATIVA"
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
                        guardarReserva
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
                        label="Buscar reserva"
                        value={
                            search
                        }
                        placeholder={
                            esSocio
                                ? "Clase, fecha o estado"
                                : "Socio, clase, fecha o estado"
                        }
                        onChange={
                            setSearch
                        }
                    />

                    <SelectFilter
                        label="Estado"
                        value={
                            estado
                        }
                        options={[
                            {
                                value: "",
                                label:
                                    "Todos los estados"
                            },
                            {
                                value:
                                    "ACTIVA",
                                label:
                                    "ACTIVA"
                            },
                            {
                                value:
                                    "CANCELADA",
                                label:
                                    "CANCELADA"
                            }
                        ]}
                        onChange={
                            (value) =>
                                setEstado(
                                    value as
                                        EstadoReserva |
                                        ""
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
                {reservasVisibles.length}
                {" "}de{" "}
                {reservasFiltradas.length}
                {" "}resultado(s).

            </p>

            {reservasFiltradas
                .length === 0 ? (

                <EmptyState
                    title={
                        "No hay reservas"
                    }
                    description={
                        esSocio
                            ? "Todavía no tienes reservas que coincidan con los filtros."
                            : "No existen reservas que coincidan con los filtros seleccionados."
                    }
                />

            ) : (

                <>

                    <ReservaTable
                        reservas={
                            reservasVisibles
                        }
                        horarios={
                            horarios
                        }
                        clases={
                            clases
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
                        onCancelar={
                            setPendingCancel
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

            )}

            <ConfirmDialog
                open={
                    pendingCancel !==
                    null
                }
                title={
                    "Cancelar reserva"
                }
                message={
                    pendingCancel
                        ? `¿Confirmas cancelar la reserva #${pendingCancel.id}? El backend determinará si la cancelación es tardía.`
                        : ""
                }
                confirmLabel={
                    "Cancelar reserva"
                }
                confirming={
                    procesandoId !==
                    null
                }
                onConfirm={() =>
                    void confirmarCancelacion()
                }
                onCancel={() =>
                    setPendingCancel(
                        null
                    )
                }
            />

        </section>
    );
}