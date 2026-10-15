import {
    useEffect,
    useMemo,
    useState
} from "react";

import type {
    Plan
} from "../models/Plan";

import type {
    PlanRequest
} from "../services/planService";

import PlanForm
    from "../components/PlanForm";

import {
    Button
} from "../components/ui/Button";

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
    planService
} from "../services/planService";

import {
    usePlanes
} from "../hooks/usePlanes";

import "./FitclubTables.css";
import "./Catalogos.css";

export default function PlanesPage() {

    const {
        data: planes,
        setData: setPlanes,
        loading: cargando,
        error,
        setError,
        reload
    } = usePlanes();

    const [
        mostrarFormulario,
        setMostrarFormulario
    ] = useState(false);

    const [
        planEditar,
        setPlanEditar
    ] =
        useState<Plan | null>(
            null
        );

    const [
        guardando,
        setGuardando
    ] = useState(false);

    const [
        mensaje,
        setMensaje
    ] = useState("");

    const [
        search,
        setSearch
    ] = useState("");

    const [
        page,
        setPage
    ] = useState(1);

    const [
        pageSize,
        setPageSize
    ] = useState(10);

    useEffect(() => {
        setPage(1);
    }, [
        search,
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

    const planesFiltrados =
        useMemo(() => {

            const term =
                search
                    .trim()
                    .toLowerCase();

            if (!term) {
                return planes;
            }

            return planes.filter(
                (plan) =>
                    [
                        plan.nombre,
                        plan.descripcion,
                        String(plan.precio),
                        String(plan.duracionDias)
                    ]
                        .join(" ")
                        .toLowerCase()
                        .includes(term)
            );

        }, [
            planes,
            search
        ]);

    const totalPages =
        Math.max(
            1,
            Math.ceil(
                planesFiltrados.length /
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

    const planesVisibles =
        useMemo(() => {

            const inicio =
                (page - 1) *
                pageSize;

            return planesFiltrados
                .slice(
                    inicio,
                    inicio + pageSize
                );

        }, [
            planesFiltrados,
            page,
            pageSize
        ]);

    function nuevoPlan() {

        setPlanEditar(null);

        setMostrarFormulario(
            true
        );

        setError("");
        setMensaje("");
    }

    function editarPlan(
        plan: Plan
    ) {

        setPlanEditar(
            plan
        );

        setMostrarFormulario(
            true
        );

        setError("");
        setMensaje("");
    }

    function cancelarFormulario() {

        if (guardando) {
            return;
        }

        setPlanEditar(null);

        setMostrarFormulario(
            false
        );
    }

    async function guardarPlan(
        datos: PlanRequest
    ) {

        if (guardando) {
            return;
        }

        setGuardando(true);
        setError("");

        try {

            if (planEditar) {

                const actualizado =
                    await planService
                        .actualizar(
                            planEditar.id,
                            datos
                        );

                setPlanes(
                    (actuales) =>
                        actuales.map(
                            (plan) =>
                                plan.id ===
                                actualizado.id
                                    ? actualizado
                                    : plan
                        )
                );

                setMensaje(
                    "Plan actualizado correctamente."
                );

            } else {

                const creado =
                    await planService
                        .crear(datos);

                setPlanes(
                    (actuales) => [
                        creado,
                        ...actuales
                    ]
                );

                setMensaje(
                    "Plan registrado correctamente."
                );
            }

            setPlanEditar(null);

            setMostrarFormulario(
                false
            );

        } catch (err) {

            setError(
                err instanceof Error
                    ? err.message
                    : "No se pudo guardar el plan."
            );

            throw err;

        } finally {

            setGuardando(false);

        }
    }

    return (
        <section className="catalog-page module-page">

            <header className="catalog-header">

                <div>
                    <h1>
                        Gestión de Planes
                    </h1>

                    <p>
                        Consulta, registro y edición
                        de los planes de FitClub.
                    </p>
                </div>

                <div className="catalog-actions">

                    <Button
                        type="button"
                        variant="secondary"
                        disabled={
                            cargando ||
                            guardando
                        }
                        onClick={reload}
                    >
                        Actualizar lista
                    </Button>

                    <Button
                        type="button"
                        disabled={
                            cargando ||
                            guardando
                        }
                        onClick={
                            nuevoPlan
                        }
                    >
                        + Nuevo plan
                    </Button>

                </div>

            </header>

            {mensaje && (
                <div
                    className="catalog-success"
                    role="status"
                >
                    {mensaje}
                </div>
            )}

            {error && (
                <div
                    className="catalog-error"
                    role="alert"
                >
                    {error}
                </div>
            )}

            {mostrarFormulario && (
                <PlanForm
                    key={
                        planEditar?.id ??
                        "nuevo"
                    }
                    planEditar={
                        planEditar
                    }
                    onGuardar={
                        guardarPlan
                    }
                    onCancelar={
                        cancelarFormulario
                    }
                />
            )}

            <section className="filter-panel">

                <div className="filter-panel__grid">

                    <SearchInput
                        label="Buscar plan"
                        value={search}
                        placeholder={
                            "Nombre, descripción, precio o duración"
                        }
                        onChange={
                            setSearch
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
                        onChange={
                            (value) =>
                                setPageSize(
                                    Number(value)
                                )
                        }
                    />

                </div>

            </section>

            <p className="results-summary">
                Mostrando{" "}
                {planesVisibles.length}
                {" "}de{" "}
                {planesFiltrados.length}
                {" "}resultado(s).
            </p>

            {cargando ? (

                <p>
                    Cargando planes...
                </p>

            ) : planesFiltrados.length === 0 ? (

                <EmptyState
                    title="No se encontraron planes"
                    description={
                        "Prueba con otro término de búsqueda o registra un nuevo plan."
                    }
                />

            ) : (

                <>

                    <div className="table-wrapper">

                        <table className="fitclub-table">

                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nombre</th>
                                <th>Descripción</th>
                                <th>Precio (Bs)</th>
                                <th>Duración</th>
                                <th>Acciones</th>
                            </tr>
                            </thead>

                            <tbody>

                            {planesVisibles.map(
                                (plan) => (

                                    <tr key={plan.id}>

                                        <td>
                                            {plan.id}
                                        </td>

                                        <td>
                                            {plan.nombre}
                                        </td>

                                        <td>
                                            {plan.descripcion || "—"}
                                        </td>

                                        <td>
                                            {Number(
                                                plan.precio
                                            ).toFixed(2)}
                                        </td>

                                        <td>
                                            {plan.duracionDias} días
                                        </td>

                                        <td>

                                            <Button
                                                type="button"
                                                variant="ghost"
                                                disabled={
                                                    guardando
                                                }
                                                onClick={() =>
                                                    editarPlan(
                                                        plan
                                                    )
                                                }
                                            >
                                                Editar
                                            </Button>

                                        </td>

                                    </tr>
                                )
                            )}

                            </tbody>

                        </table>

                    </div>

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

            <p className="catalog-note">
                Crear o editar planes requiere rol
                ADMINISTRADOR. Los demás roles
                autenticados pueden consultarlos.
            </p>

        </section>
    );
}