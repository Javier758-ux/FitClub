import {
    useEffect,
    useMemo,
    useState
} from "react";

import type {
    SocioApi,
    MembresiaRequest
} from "../models/ApiModels";

import type {
    Plan
} from "../models/Plan";

import type {
    Membresia,
    EstadoMembresia
} from "../models/Membresia";

import MembresiaForm
    from "../components/MembresiaForm";

import MembresiaTable
    from "../components/MembresiaTable";

import {
    SearchInput
} from "../components/ui/SearchInput";

import {
    SelectFilter
} from "../components/ui/SelectFilter";

import {
    Pagination
} from "../components/ui/Pagination";

import {
    EmptyState
} from "../components/ui/EmptyState";

import {
    ConfirmDialog
} from "../components/ui/ConfirmDialog";

import {
    Button
} from "../components/ui/Button";

import {
    socioService
} from "../services/socioService";

import {
    planService
} from "../services/planService";

import {
    membresiaService
} from "../services/membresiaService";

import "./FitclubTables.css";

export default function MembresiasPage() {

    const [
        membresias,
        setMembresias
    ] =
        useState<Membresia[]>([]);

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
    ] = useState(true);

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
    ] = useState(false);

    const [
        pendingCancel,
        setPendingCancel
    ] =
        useState<Membresia | null>(
            null
        );

    const [
        search,
        setSearch
    ] = useState("");

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
    ] = useState(1);

    const [
        pageSize,
        setPageSize
    ] = useState(10);

    const [
        error,
        setError
    ] = useState("");

    const [
        mensaje,
        setMensaje
    ] = useState("");

    useEffect(() => {

        let activo = true;

        Promise.all([
            membresiaService.listar(),
            socioService.listar(
                0,
                100
            ),
            planService.listar()
        ])
            .then(
                ([
                     listaMembresias,
                     paginaSocios,
                     listaPlanes
                 ]) => {

                    if (!activo) {
                        return;
                    }

                    setMembresias(
                        listaMembresias
                    );

                    setSocios(
                        paginaSocios.contenido
                    );

                    setPlanes(
                        listaPlanes
                    );
                }
            )
            .catch(
                (err: unknown) => {

                    if (activo) {

                        setError(
                            err instanceof Error
                                ? err.message
                                : "No se pudieron cargar las membresías."
                        );
                    }
                }
            )
            .finally(() => {

                if (activo) {
                    setCargando(false);
                }
            });

        return () => {
            activo = false;
        };

    }, []);

    useEffect(() => {

        setPage(1);

    }, [
        search,
        estado,
        pageSize
    ]);

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
                            membresia.estado
                        ]
                            .join(" ")
                            .toLowerCase();

                    const coincideTexto =
                        !term ||
                        texto.includes(term);

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

    const totalPages =
        Math.max(
            1,
            Math.ceil(
                membresiasFiltradas.length /
                pageSize
            )
        );

    useEffect(() => {

        if (
            page > totalPages
        ) {
            setPage(
                totalPages
            );
        }

    }, [
        page,
        totalPages
    ]);

    const visibles =
        useMemo(() => {

            const inicio =
                (page - 1) *
                pageSize;

            return membresiasFiltradas.slice(
                inicio,
                inicio + pageSize
            );

        }, [
            membresiasFiltradas,
            page,
            pageSize
        ]);

    async function guardarMembresia(
        datos: MembresiaRequest
    ) {

        const creada =
            await membresiaService
                .crear(datos);

        setMembresias(
            (anteriores) => [
                creada,
                ...anteriores
            ]
        );

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

            setProcesandoId(null);

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

            setProcesandoId(null);

        }
    }

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

            setProcesandoId(null);

        }
    }

    return (
        <section className="module-page">

            <h1>
                Gestión de Membresías
            </h1>

            <p>
                Búsqueda, filtros,
                estados y acciones.
            </p>

            <div className="module-toolbar">

                <div />

                <div className="module-toolbar__actions">

                    <Button
                        type="button"
                        onClick={() =>
                            setMostrarFormulario(
                                (valor) => !valor
                            )
                        }
                    >
                        {mostrarFormulario
                            ? "Cerrar formulario"
                            : "+ Nueva membresía"}
                    </Button>

                </div>
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

            {mostrarFormulario && (
                <MembresiaForm
                    socios={socios}
                    planes={planes}
                    onGuardar={
                        guardarMembresia
                    }
                />
            )}

            <section className="filter-panel">

                <div className="filter-panel__grid">

                    <SearchInput
                        label="Buscar membresía"
                        value={search}
                        placeholder={
                            "Socio, plan o estado"
                        }
                        onChange={
                            setSearch
                        }
                    />

                    <SelectFilter
                        label="Estado"
                        value={estado}
                        options={[
                            {
                                value: "",
                                label:
                                    "Todos los estados"
                            },
                            {
                                value: "ACTIVA",
                                label: "ACTIVA"
                            },
                            {
                                value: "SUSPENDIDA",
                                label: "SUSPENDIDA"
                            },
                            {
                                value: "VENCIDA",
                                label: "VENCIDA"
                            },
                            {
                                value: "CANCELADA",
                                label: "CANCELADA"
                            }
                        ]}
                        onChange={(value) =>
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
                            String(pageSize)
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
                        onChange={(value) =>
                            setPageSize(
                                Number(value)
                            )
                        }
                    />

                </div>

            </section>

            <p className="results-summary">
                Mostrando{" "}
                {visibles.length} de{" "}
                {membresiasFiltradas.length}
                {" "}resultado(s).
            </p>

            {cargando ? (

                <p>
                    Cargando membresías...
                </p>

            ) : membresiasFiltradas.length === 0 ? (

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
                        socios={socios}
                        planes={planes}
                        procesandoId={
                            procesandoId
                        }
                        onSuspender={
                            (membresia) =>
                                void suspender(
                                    membresia
                                )
                        }
                        onReactivar={
                            (membresia) =>
                                void reactivar(
                                    membresia
                                )
                        }
                        onCancelar={
                            setPendingCancel
                        }
                    />

                    <Pagination
                        page={page}
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
                    pendingCancel !== null
                }
                title="Cancelar membresía"
                message={
                    pendingCancel
                        ? `¿Confirmas cancelar la membresía #${pendingCancel.id}?`
                        : ""
                }
                confirmLabel="Cancelar membresía"
                confirming={
                    procesandoId !== null
                }
                onConfirm={() =>
                    void confirmarCancelar()
                }
                onCancel={() =>
                    setPendingCancel(null)
                }
            />

        </section>
    );
}