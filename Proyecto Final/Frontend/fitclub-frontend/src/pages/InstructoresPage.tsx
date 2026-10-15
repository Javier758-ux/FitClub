import {
    useEffect,
    useMemo,
    useState
} from "react";

import type {
    InstructorApi
} from "../models/ApiModels";

import type {
    InstructorRequest
} from "../services/instructorService";

import InstructorForm
    from "../components/InstructorForm";

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
    instructorService
} from "../services/instructorService";

import {
    useInstructores
} from "../hooks/useInstructores";

import "./FitclubTables.css";
import "./Catalogos.css";

export default function InstructoresPage() {

    const {
        data: instructores,
        setData: setInstructores,
        loading: cargando,
        error,
        setError,
        reload
    } = useInstructores();

    const [
        mostrarFormulario,
        setMostrarFormulario
    ] = useState(false);

    const [
        instructorEditar,
        setInstructorEditar
    ] =
        useState<InstructorApi | null>(
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

    const instructoresFiltrados =
        useMemo(() => {

            const term =
                search
                    .trim()
                    .toLowerCase();

            if (!term) {
                return instructores;
            }

            return instructores.filter(
                (instructor) =>
                    [
                        instructor.nombre,
                        instructor.email,
                        instructor.telefono,
                        instructor.especialidad
                    ]
                        .join(" ")
                        .toLowerCase()
                        .includes(term)
            );

        }, [
            instructores,
            search
        ]);

    const totalPages =
        Math.max(
            1,
            Math.ceil(
                instructoresFiltrados.length /
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

    const instructoresVisibles =
        useMemo(() => {

            const inicio =
                (page - 1) *
                pageSize;

            return instructoresFiltrados
                .slice(
                    inicio,
                    inicio + pageSize
                );

        }, [
            instructoresFiltrados,
            page,
            pageSize
        ]);

    function nuevoInstructor() {

        setInstructorEditar(
            null
        );

        setMostrarFormulario(
            true
        );

        setError("");
        setMensaje("");
    }

    function editarInstructor(
        instructor: InstructorApi
    ) {

        setInstructorEditar(
            instructor
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

        setInstructorEditar(
            null
        );

        setMostrarFormulario(
            false
        );
    }

    async function guardarInstructor(
        datos: InstructorRequest
    ) {

        if (guardando) {
            return;
        }

        setGuardando(true);
        setError("");

        try {

            if (instructorEditar) {

                const actualizado =
                    await instructorService
                        .actualizar(
                            instructorEditar.id,
                            datos
                        );

                setInstructores(
                    (actuales) =>
                        actuales.map(
                            (instructor) =>
                                instructor.id ===
                                actualizado.id
                                    ? actualizado
                                    : instructor
                        )
                );

                setMensaje(
                    "Instructor actualizado correctamente."
                );

            } else {

                const creado =
                    await instructorService
                        .crear(datos);

                setInstructores(
                    (actuales) => [
                        creado,
                        ...actuales
                    ]
                );

                setMensaje(
                    "Instructor registrado correctamente."
                );
            }

            setInstructorEditar(
                null
            );

            setMostrarFormulario(
                false
            );

        } catch (err) {

            setError(
                err instanceof Error
                    ? err.message
                    : "No se pudo guardar el instructor."
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
                        Gestión de Instructores
                    </h1>

                    <p>
                        Consulta, registro y edición
                        del equipo de instructores.
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
                            nuevoInstructor
                        }
                    >
                        + Nuevo instructor
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
                <InstructorForm
                    key={
                        instructorEditar?.id ??
                        "nuevo"
                    }
                    instructorEditar={
                        instructorEditar
                    }
                    onGuardar={
                        guardarInstructor
                    }
                    onCancelar={
                        cancelarFormulario
                    }
                />
            )}

            <section className="filter-panel">

                <div className="filter-panel__grid">

                    <SearchInput
                        label="Buscar instructor"
                        value={search}
                        placeholder={
                            "Nombre, correo, teléfono o especialidad"
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
                {instructoresVisibles.length}
                {" "}de{" "}
                {instructoresFiltrados.length}
                {" "}resultado(s).
            </p>

            {cargando ? (

                <p>
                    Cargando instructores...
                </p>

            ) : instructoresFiltrados.length === 0 ? (

                <EmptyState
                    title="No se encontraron instructores"
                    description={
                        "Prueba con otra búsqueda o registra un nuevo instructor."
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
                                <th>Correo</th>
                                <th>Teléfono</th>
                                <th>Especialidad</th>
                                <th>Acciones</th>
                            </tr>
                            </thead>

                            <tbody>

                            {instructoresVisibles.map(
                                (instructor) => (

                                    <tr key={instructor.id}>

                                        <td>
                                            {instructor.id}
                                        </td>

                                        <td>
                                            {instructor.nombre}
                                        </td>

                                        <td>
                                            {instructor.email}
                                        </td>

                                        <td>
                                            {instructor.telefono}
                                        </td>

                                        <td>
                                            {instructor.especialidad}
                                        </td>

                                        <td>

                                            <Button
                                                type="button"
                                                variant="ghost"
                                                disabled={
                                                    guardando
                                                }
                                                onClick={() =>
                                                    editarInstructor(
                                                        instructor
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
                Crear o editar instructores requiere
                rol ADMINISTRADOR. Los demás roles
                autenticados pueden consultarlos.
            </p>

        </section>
    );
}