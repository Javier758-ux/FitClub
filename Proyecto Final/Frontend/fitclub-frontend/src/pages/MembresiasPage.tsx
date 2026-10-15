import {
    useEffect,
    useMemo,
    useState
} from "react";

import type {
    HistorialMembresiaApi,
    MembresiaRequest,
    SocioApi
} from "../models/ApiModels";

import type {
    Plan
} from "../models/Plan";

import type {
    EstadoMembresia,
    Membresia
} from "../models/Membresia";

import HistorialMembresiaTable
    from "../components/HistorialMembresiaTable";

import MembresiaForm
    from "../components/MembresiaForm";

import MembresiaTable
    from "../components/MembresiaTable";

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
    MetricCard
} from "../components/ui/MetricCard";

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
    historialMembresiaService
} from "../services/historialMembresiaService";

import {
    membresiaService
} from "../services/membresiaService";

import {
    planService
} from "../services/planService";

import {
    socioService
} from "../services/socioService";

import {
    isAbortError
} from "../utils/isAbortError";

import "./FitclubTables.css";
import "./Membresias.css";

type VistaMembresias =
    | "MEMBRESIAS"
    | "HISTORIAL";

export default function MembresiasPage() {

    const [
        membresias,
        setMembresias
    ] =
        useState<Membresia[]>([]);

    const [
        historial,
        setHistorial
    ] =
        useState<
            HistorialMembresiaApi[]
        >([]);

    const [
        socios,
        setSocios
    ] =
        useState<SocioApi[]>([]);

    const [
        planes,
        setPlanes
    ] =
        useState<Plan[]>([]);

    const [
        cargando,
        setCargando
    ] =
        useState(true);

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
        pendingCancel,
        setPendingCancel
    ] =
        useState<Membresia | null>(
            null
        );

    const [
        vista,
        setVista
    ] =
        useState<VistaMembresias>(
            "MEMBRESIAS"
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
            EstadoMembresia | ""
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
        searchHistorial,
        setSearchHistorial
    ] =
        useState("");

    const [
        pageHistorial,
        setPageHistorial
    ] =
        useState(1);

    const [
        pageSizeHistorial,
        setPageSizeHistorial
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

        async function cargarDatos() {

            try {

                setCargando(
                    true
                );

                setError("");

                const [
                    listaMembresias,
                    listaHistorial,
                    paginaSocios,
                    listaPlanes
                ] =
                    await Promise.all([

                        membresiaService.listar(
                            undefined,
                            undefined,
                            controller.signal
                        ),

                        historialMembresiaService.listar(
                            controller.signal
                        ),

                        socioService.listar(
                            0,
                            100,
                            controller.signal
                        ),

                        planService.listar(
                            controller.signal
                        )

                    ]);

                if (!activo) {
                    return;
                }

                setMembresias(
                    listaMembresias
                );

                setHistorial(
                    [
                        ...listaHistorial
                    ].sort(
                        (a, b) =>
                            b.fechaCambio.localeCompare(
                                a.fechaCambio
                            )
                    )
                );

                setSocios(
                    paginaSocios.contenido
                );

                setPlanes(
                    listaPlanes
                );

            } catch (err) {

                if (
                    activo &&
                    !isAbortError(err)
                ) {

                    setError(
                        err instanceof Error
                            ? err.message
                            : "No se pudieron cargar las membresías."
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

        void cargarDatos();

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

        setPageHistorial(
            1
        );

    }, [
        searchHistorial,
        pageSizeHistorial
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

    const planesPorId =
        useMemo(
            () =>
                new Map(
                    planes.map(
                        (plan) => [
                            plan.id,
                            plan
                        ]
                    )
                ),
            [planes]
        );

    const membresiasPorId =
        useMemo(
            () =>
                new Map(
                    membresias.map(
                        (membresia) => [
                            membresia.id,
                            membresia
                        ]
                    )
                ),
            [membresias]
        );

    const resumen =
        useMemo(
            () => ({

                activas:
                membresias.filter(
                    (membresia) =>
                        membresia.estado ===
                        "ACTIVA"
                ).length,

                vencidas:
                membresias.filter(
                    (membresia) =>
                        membresia.estado ===
                        "VENCIDA"
                ).length,

                suspendidas:
                membresias.filter(
                    (membresia) =>
                        membresia.estado ===
                        "SUSPENDIDA"
                ).length,

                canceladas:
                membresias.filter(
                    (membresia) =>
                        membresia.estado ===
                        "CANCELADA"
                ).length

            }),
            [membresias]
        );

    const membresiasFiltradas =
        useMemo(() => {

            const term =
                search
                    .trim()
                    .toLowerCase();

            return membresias.filter(
                (membresia) => {

                    const socio =
                        sociosPorId.get(
                            membresia.socioId
                        );

                    const plan =
                        planesPorId.get(
                            membresia.planId
                        );

                    const texto =
                        [
                            membresia.id,
                            socio?.nombre ?? "",
                            socio?.email ?? "",
                            plan?.nombre ?? "",
                            membresia.estado,
                            membresia.fechaInicio,
                            membresia.fechaFin
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
                        membresia.estado ===
                        estado;

                    return (
                        coincideTexto &&
                        coincideEstado
                    );
                }
            );

        }, [
            membresias,
            search,
            estado,
            sociosPorId,
            planesPorId
        ]);

    const historialFiltrado =
        useMemo(() => {

            const term =
                searchHistorial
                    .trim()
                    .toLowerCase();

            if (!term) {
                return historial;
            }

            return historial.filter(
                (registro) => {

                    const membresia =
                        membresiasPorId.get(
                            registro.membresiaId
                        );

                    const socio =
                        membresia
                            ? sociosPorId.get(
                                membresia.socioId
                            )
                            : undefined;

                    const plan =
                        membresia
                            ? planesPorId.get(
                                membresia.planId
                            )
                            : undefined;

                    const texto = [

                        registro.id,

                        registro.membresiaId,

                        registro.estadoAnterior ??
                        "creada",

                        registro.estadoNuevo,

                        registro.motivo,

                        registro.usuarioEmail,

                        registro.fechaCambio,

                        socio?.nombre ??
                        "",

                        socio?.email ??
                        "",

                        plan?.nombre ??
                        ""

                    ]
                        .join(" ")
                        .toLowerCase();

                    return texto.includes(
                        term
                    );
                }
            );

        }, [
            historial,
            searchHistorial,
            membresiasPorId,
            sociosPorId,
            planesPorId
        ]);

    const totalPages =
        Math.max(
            1,
            Math.ceil(
                membresiasFiltradas.length /
                pageSize
            )
        );

    const totalPagesHistorial =
        Math.max(
            1,
            Math.ceil(
                historialFiltrado.length /
                pageSizeHistorial
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

    useEffect(() => {

        if (
            pageHistorial >
            totalPagesHistorial
        ) {

            setPageHistorial(
                totalPagesHistorial
            );
        }

    }, [
        pageHistorial,
        totalPagesHistorial
    ]);

    const visibles =
        useMemo(() => {

            const inicio =
                (page - 1) *
                pageSize;

            return membresiasFiltradas
                .slice(
                    inicio,
                    inicio + pageSize
                );

        }, [
            membresiasFiltradas,
            page,
            pageSize
        ]);

    const historialVisible =
        useMemo(() => {

            const inicio =
                (pageHistorial - 1) *
                pageSizeHistorial;

            return historialFiltrado
                .slice(
                    inicio,
                    inicio +
                    pageSizeHistorial
                );

        }, [
            historialFiltrado,
            pageHistorial,
            pageSizeHistorial
        ]);

    function actualizarEnLista(
        actualizada: Membresia
    ) {

        setMembresias(
            (anteriores) =>
                anteriores.map(
                    (membresia) =>
                        membresia.id ===
                        actualizada.id
                            ? actualizada
                            : membresia
                )
        );
    }

    async function refrescarHistorial() {

        const lista =
            await historialMembresiaService
                .listar();

        setHistorial(
            [...lista].sort(
                (a, b) =>
                    b.fechaCambio.localeCompare(
                        a.fechaCambio
                    )
            )
        );
    }

    async function guardarMembresia(
        datos: MembresiaRequest
    ) {

        const creada =
            await membresiaService
                .crear(
                    datos
                );

        setMembresias(
            (anteriores) => [
                creada,
                ...anteriores
            ]
        );

        await refrescarHistorial();

        setMostrarFormulario(
            false
        );

        setMensaje(
            "Membresía registrada correctamente."
        );

        setError("");
    }

    async function suspender(
        membresia: Membresia
    ) {

        setProcesandoId(
            membresia.id
        );

        setError("");

        try {

            const actualizada =
                await membresiaService
                    .suspender(
                        membresia.id
                    );

            actualizarEnLista(
                actualizada
            );

            await refrescarHistorial();

            setMensaje(
                "Membresía suspendida correctamente."
            );

        } catch (err) {

            setError(
                err instanceof Error
                    ? err.message
                    : "No se pudo suspender la membresía."
            );

        } finally {

            setProcesandoId(
                null
            );
        }
    }

    async function reactivar(
        membresia: Membresia
    ) {

        setProcesandoId(
            membresia.id
        );

        setError("");

        try {

            const actualizada =
                await membresiaService
                    .reactivar(
                        membresia.id
                    );

            actualizarEnLista(
                actualizada
            );

            await refrescarHistorial();

            setMensaje(
                "Membresía reactivada correctamente."
            );

        } catch (err) {

            setError(
                err instanceof Error
                    ? err.message
                    : "No se pudo reactivar la membresía."
            );

        } finally {

            setProcesandoId(
                null
            );
        }
    }

    async function confirmarCancelar() {

        if (!pendingCancel) {
            return;
        }

        const membresia =
            pendingCancel;

        setProcesandoId(
            membresia.id
        );

        setError("");

        try {

            const actualizada =
                await membresiaService
                    .cancelar(
                        membresia.id
                    );

            actualizarEnLista(
                actualizada
            );

            await refrescarHistorial();

            setPendingCancel(
                null
            );

            setMensaje(
                "Membresía cancelada correctamente."
            );

        } catch (err) {

            setError(
                err instanceof Error
                    ? err.message
                    : "No se pudo cancelar la membresía."
            );

        } finally {

            setProcesandoId(
                null
            );
        }
    }

    async function actualizarTodo() {

        setCargando(
            true
        );

        setError("");

        try {

            const [
                listaMembresias,
                listaHistorial
            ] =
                await Promise.all([

                    membresiaService.listar(),

                    historialMembresiaService
                        .listar()

                ]);

            setMembresias(
                listaMembresias
            );

            setHistorial(
                [...listaHistorial].sort(
                    (a, b) =>
                        b.fechaCambio.localeCompare(
                            a.fechaCambio
                        )
                )
            );

            setMensaje(
                "Membresías e historial actualizados."
            );

        } catch (err) {

            setError(
                err instanceof Error
                    ? err.message
                    : "No se pudo actualizar la información."
            );

        } finally {

            setCargando(
                false
            );
        }
    }

    return (
        <section className="module-page">

            <header className="module-toolbar">

                <div>

                    <h1>
                        Gestión de Membresías
                    </h1>

                    <p>
                        Vigencias, cambios de estado
                        e historial de membresías.
                    </p>

                </div>

                <div className="module-toolbar__actions">

                    <Button
                        type="button"
                        variant="secondary"
                        disabled={
                            cargando ||
                            procesandoId !==
                            null
                        }
                        onClick={() =>
                            void actualizarTodo()
                        }
                    >
                        Actualizar
                    </Button>

                    {
                        vista ===
                        "MEMBRESIAS" && (

                            <Button
                                type="button"
                                disabled={
                                    cargando ||
                                    procesandoId !==
                                    null
                                }
                                onClick={() =>
                                    setMostrarFormulario(
                                        (valor) =>
                                            !valor
                                    )
                                }
                            >

                                {mostrarFormulario
                                    ? "Cerrar formulario"
                                    : "+ Nueva membresía"}

                            </Button>

                        )
                    }

                </div>

            </header>

            <div className="memberships-summary">

                <MetricCard
                    label="Activas"
                    value={
                        resumen.activas
                    }
                    helper="Membresías vigentes"
                />

                <MetricCard
                    label="Vencidas"
                    value={
                        resumen.vencidas
                    }
                    helper="Vigencia finalizada"
                />

                <MetricCard
                    label="Suspendidas"
                    value={
                        resumen.suspendidas
                    }
                    helper="Temporalmente inactivas"
                />

                <MetricCard
                    label="Canceladas"
                    value={
                        resumen.canceladas
                    }
                    helper="Finalizadas manualmente"
                />

            </div>

            <div className="memberships-view-switch">

                <Button
                    type="button"
                    variant={
                        vista ===
                        "MEMBRESIAS"
                            ? "primary"
                            : "secondary"
                    }
                    onClick={() =>
                        setVista(
                            "MEMBRESIAS"
                        )
                    }
                >
                    Membresías
                </Button>

                <Button
                    type="button"
                    variant={
                        vista ===
                        "HISTORIAL"
                            ? "primary"
                            : "secondary"
                    }
                    onClick={() => {

                        setVista(
                            "HISTORIAL"
                        );

                        setMostrarFormulario(
                            false
                        );

                    }}
                >
                    Historial de cambios
                </Button>

            </div>

            {mensaje && (

                <p role="status">
                    {mensaje}
                </p>

            )}

            {error && (

                <p
                    className="field-error"
                    role="alert"
                >
                    {error}
                </p>

            )}

            {
                vista ===
                "MEMBRESIAS"
                    ? (

                        <>

                            {mostrarFormulario && (

                                <MembresiaForm
                                    socios={
                                        socios
                                    }
                                    planes={
                                        planes
                                    }
                                    onGuardar={
                                        guardarMembresia
                                    }
                                />

                            )}

                            <section className="filter-panel">

                                <div className="filter-panel__grid">

                                    <SearchInput
                                        label="Buscar membresía"
                                        value={
                                            search
                                        }
                                        placeholder={
                                            "Socio, plan, fecha o estado"
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
                                                    "SUSPENDIDA",
                                                label:
                                                    "SUSPENDIDA"
                                            },
                                            {
                                                value:
                                                    "VENCIDA",
                                                label:
                                                    "VENCIDA"
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
                                                        EstadoMembresia |
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
                                {
                                    visibles.length
                                }
                                {" "}de{" "}
                                {
                                    membresiasFiltradas.length
                                }
                                {" "}resultado(s).

                            </p>

                            {cargando ? (

                                <p>
                                    Cargando membresías...
                                </p>

                            ) : membresiasFiltradas.length ===
                            0 ? (

                                <EmptyState
                                    title="No hay membresías"
                                    description={
                                        "No existen registros que coincidan con los filtros."
                                    }
                                />

                            ) : (

                                <>

                                    <MembresiaTable
                                        membresias={
                                            visibles
                                        }
                                        socios={
                                            socios
                                        }
                                        planes={
                                            planes
                                        }
                                        procesandoId={
                                            procesandoId
                                        }
                                        onSuspender={
                                            (
                                                membresia
                                            ) =>
                                                void suspender(
                                                    membresia
                                                )
                                        }
                                        onReactivar={
                                            (
                                                membresia
                                            ) =>
                                                void reactivar(
                                                    membresia
                                                )
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

                        </>

                    )
                    : (

                        <>

                            <section className="filter-panel">

                                <div className="filter-panel__grid">

                                    <SearchInput
                                        label="Buscar en historial"
                                        value={
                                            searchHistorial
                                        }
                                        placeholder={
                                            "Socio, plan, estado, motivo o usuario"
                                        }
                                        onChange={
                                            setSearchHistorial
                                        }
                                    />

                                    <SelectFilter
                                        label="Registros por página"
                                        value={
                                            String(
                                                pageSizeHistorial
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
                                                setPageSizeHistorial(
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
                                    historialVisible.length
                                }
                                {" "}de{" "}
                                {
                                    historialFiltrado.length
                                }
                                {" "}cambio(s).

                            </p>

                            {cargando ? (

                                <p>
                                    Cargando historial...
                                </p>

                            ) : historialFiltrado.length ===
                            0 ? (

                                <EmptyState
                                    title="No hay historial"
                                    description={
                                        "Todavía no existen cambios de membresía que coincidan con la búsqueda."
                                    }
                                />

                            ) : (

                                <>

                                    <HistorialMembresiaTable
                                        historial={
                                            historialVisible
                                        }
                                        membresias={
                                            membresias
                                        }
                                        socios={
                                            socios
                                        }
                                        planes={
                                            planes
                                        }
                                    />

                                    <Pagination
                                        page={
                                            pageHistorial
                                        }
                                        totalPages={
                                            totalPagesHistorial
                                        }
                                        onPageChange={
                                            setPageHistorial
                                        }
                                    />

                                </>

                            )}

                            <p className="memberships-note">

                                El historial se registra
                                en el backend cuando una
                                membresía se crea, suspende,
                                reactiva, cancela o vence.

                                Los vencimientos automáticos
                                aparecen con usuario SISTEMA.

                            </p>

                        </>

                    )
            }

            <ConfirmDialog
                open={
                    pendingCancel !==
                    null
                }
                title="Cancelar membresía"
                message={
                    pendingCancel
                        ? `¿Confirmas cancelar la membresía #${pendingCancel.id}?`
                        : ""
                }
                confirmLabel="Cancelar membresía"
                confirming={
                    procesandoId !==
                    null
                }
                onConfirm={() =>
                    void confirmarCancelar()
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