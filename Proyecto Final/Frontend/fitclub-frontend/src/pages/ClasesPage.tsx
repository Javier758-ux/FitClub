import {
    useEffect,
    useMemo,
    useState
} from "react";

import type {
    ClaseApi
} from "../models/ApiModels";

import type {
    ClaseRequest
} from "../services/claseService";

import ClaseForm
    from "../components/ClaseForm";

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
    claseService
} from "../services/claseService";

import {
    useClases
} from "../hooks/useClases";

import "./FitclubTables.css";
import "./Catalogos.css";

export default function ClasesPage() {

    const {
        data: clases,
        setData: setClases,
        loading: cargando,
        error,
        setError,
        reload
    } = useClases();

    const [
        mostrarFormulario,
        setMostrarFormulario
    ] = useState(false);

    const [
        claseEditar,
        setClaseEditar
    ] =
        useState<ClaseApi | null>(
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

    const clasesFiltradas =
        useMemo(() => {

            const term =
                search
                    .trim()
                    .toLowerCase();

            if (!term) {
                return clases;
            }

            return clases.filter(
                (clase) =>
                    [
                        clase.nombre,
                        clase.descripcion,
                        String(
                            clase.cupoMaximo
                        )
                    ]
                        .join(" ")
                        .toLowerCase()
                        .includes(term)
            );

        }, [
            clases,
            search
        ]);

    const totalPages =
        Math.max(
            1,
            Math.ceil(
                clasesFiltradas.length /
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

    const clasesVisibles =
        useMemo(() => {

            const inicio =
                (page - 1) *
                pageSize;

            return clasesFiltradas
                .slice(
                    inicio,
                    inicio + pageSize
                );

        }, [
            clasesFiltradas,
            page,
            pageSize
        ]);

    function nuevaClase() {

        setClaseEditar(
            null
        );

        setMostrarFormulario(
            true
        );

        setError("");
        setMensaje("");
    }

    function editarClase(
        clase: ClaseApi
    ) {

        setClaseEditar(
            clase
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

        setClaseEditar(
            null
        );

        setMostrarFormulario(
            false
        );
    }

    async function guardarClase(
        datos: ClaseRequest
    ) {

        if (guardando) {
            return;
        }

        setGuardando(true);
        setError("");

        try {

            if (claseEditar) {

                const actualizada =
                    await claseService
                        .actualizar(
                            claseEditar.id,
                            datos
                        );

                setClases(
                    (actuales) =>
                        actuales.map(
                            (clase) =>
                                clase.id ===
                                actualizada.id
                                    ? actualizada
                                    : clase
                        )
                );

                setMensaje(
                    "Clase actualizada correctamente."
                );

            } else {

                const creada =
                    await claseService
                        .crear(datos);

                setClases(
                    (actuales) => [
                        creada,
                        ...actuales
                    ]
                );

                setMensaje(
                    "Clase registrada correctamente."
                );
            }

            setClaseEditar(null);

            setMostrarFormulario(
                false
            );

        } catch (err) {

            setError(
                err instanceof Error
                    ? err.message
                    : "No se pudo guardar la clase."
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
                        Gestión de Clases
                    </h1>

                    <p>
                        Consulta, registro y edición
                        de las clases disponibles
                        en FitClub.
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
                            nuevaClase
                        }
                    >
                        + Nueva clase
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
                <ClaseForm
                    key={
                        claseEditar?.id ??
                        "nueva"
                    }
                    claseEditar={
                        claseEditar
                    }
                    onGuardar={
                        guardarClase
                    }
                    onCancelar={
                        cancelarFormulario
                    }
                />
            )}

            <section className="filter-panel">

                <div className="filter-panel__grid">

                    <SearchInput
                        label="Buscar clase"
                        value={search}
                        placeholder={
                            "Nombre, descripción o cupo"
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
                {clasesVisibles.length}
                {" "}de{" "}
                {clasesFiltradas.length}
                {" "}resultado(s).
            </p>

            {cargando ? (

                <p>
                    Cargando clases...
                </p>

            ) : clasesFiltradas.length === 0 ? (

                <EmptyState
                    title="No se encontraron clases"
                    description={
                        "Prueba con otra búsqueda o registra una nueva clase."
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
                                <th>Cupo máximo</th>
                                <th>Acciones</th>
                            </tr>
                            </thead>

                            <tbody>

                            {clasesVisibles.map(
                                (clase) => (

                                    <tr key={clase.id}>

                                        <td>
                                            {clase.id}
                                        </td>

                                        <td>
                                            {clase.nombre}
                                        </td>

                                        <td>
                                            {clase.descripcion || "—"}
                                        </td>

                                        <td>
                                            {clase.cupoMaximo}
                                        </td>

                                        <td>

                                            <Button
                                                type="button"
                                                variant="ghost"
                                                disabled={
                                                    guardando
                                                }
                                                onClick={() =>
                                                    editarClase(
                                                        clase
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
                Crear o editar clases requiere
                rol ADMINISTRADOR. Los demás
                roles autenticados pueden
                consultarlas.
            </p>

        </section>
    );
}