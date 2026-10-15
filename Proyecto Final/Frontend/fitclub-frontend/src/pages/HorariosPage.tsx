import {
    useEffect,
    useMemo,
    useState
} from "react";

import HorarioForm
    from "../components/HorarioForm";

import HorarioTable
    from "../components/HorarioTable";

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
    Button
} from "../components/ui/Button";

import {
    horarioService
} from "../services/horarioService";

import {
    claseService
} from "../services/claseService";

import {
    instructorService
} from "../services/instructorService";

import {
    useHorarios
} from "../hooks/useHorarios";

import {
    isAbortError
} from "../utils/isAbortError";

import type {
    ClaseApi,
    InstructorApi,
    HorarioApi,
    HorarioRequest
} from "../models/ApiModels";

import "./Horarios.css";

export default function HorariosPage() {

    const {
        data: horarios,
        setData: setHorarios,
        loading: cargandoHorarios,
        error: errorHorarios,
        setError: setErrorHorarios,
        reload
    } = useHorarios();

    const [
        clases,
        setClases
    ] =
        useState<ClaseApi[]>([]);

    const [
        instructores,
        setInstructores
    ] =
        useState<InstructorApi[]>([]);

    const [
        cargandoCatalogos,
        setCargandoCatalogos
    ] = useState(true);

    const [
        horarioIdEditar,
        setHorarioIdEditar
    ] =
        useState<number | null>(
            null
        );

    const [
        horarioEditar,
        setHorarioEditar
    ] =
        useState<HorarioApi | null>(
            null
        );

    const [
        cargandoDetalle,
        setCargandoDetalle
    ] = useState(false);

    const [
        guardando,
        setGuardando
    ] = useState(false);

    const [
        mostrarFormulario,
        setMostrarFormulario
    ] = useState(false);

    const [
        search,
        setSearch
    ] = useState("");

    const [
        filtroClase,
        setFiltroClase
    ] = useState("");

    const [
        filtroInstructor,
        setFiltroInstructor
    ] = useState("");

    const [
        page,
        setPage
    ] = useState(1);

    const [
        pageSize,
        setPageSize
    ] = useState(10);

    const [
        errorCatalogos,
        setErrorCatalogos
    ] = useState("");

    const [
        errorOperacion,
        setErrorOperacion
    ] = useState("");

    const [
        mensaje,
        setMensaje
    ] = useState("");

    useEffect(() => {

        const controller =
            new AbortController();

        let ignore = false;

        async function cargarCatalogos() {

            try {

                setCargandoCatalogos(
                    true
                );

                setErrorCatalogos("");

                const [
                    paginaClases,
                    paginaInstructores
                ] =
                    await Promise.all([
                        claseService.listar(
                            0,
                            100,
                            controller.signal
                        ),

                        instructorService.listar(
                            0,
                            100,
                            controller.signal
                        )
                    ]);

                if (!ignore) {

                    setClases(
                        paginaClases.contenido
                    );

                    setInstructores(
                        paginaInstructores.contenido
                    );
                }

            } catch (err) {

                if (
                    !ignore &&
                    !isAbortError(err)
                ) {

                    setErrorCatalogos(
                        err instanceof Error
                            ? err.message
                            : "No se pudieron cargar clases e instructores."
                    );
                }

            } finally {

                if (
                    !ignore &&
                    !controller.signal.aborted
                ) {

                    setCargandoCatalogos(
                        false
                    );
                }
            }
        }

        void cargarCatalogos();

        return () => {

            ignore = true;

            controller.abort();
        };

    }, []);

    useEffect(() => {

        if (
            horarioIdEditar === null
        ) {
            return;
        }

        const controller =
            new AbortController();

        let ignore = false;

        async function cargarDetalle() {

            try {

                setCargandoDetalle(
                    true
                );

                setErrorOperacion("");

                const horario =
                    await horarioService
                        .buscarPorId(
                            horarioIdEditar!,
                            controller.signal
                        );

                if (!ignore) {

                    setHorarioEditar(
                        horario
                    );

                    setMostrarFormulario(
                        true
                    );
                }

            } catch (err) {

                if (
                    !ignore &&
                    !isAbortError(err)
                ) {

                    setErrorOperacion(
                        err instanceof Error
                            ? err.message
                            : "No se pudo cargar el horario."
                    );
                }

            } finally {

                if (
                    !ignore &&
                    !controller.signal.aborted
                ) {

                    setCargandoDetalle(
                        false
                    );
                }
            }
        }

        void cargarDetalle();

        return () => {

            ignore = true;

            controller.abort();
        };

    }, [horarioIdEditar]);

    useEffect(() => {

        if (!mensaje) {
            return;
        }

        const timer =
            window.setTimeout(
                () => {
                    setMensaje("");
                },
                2500
            );

        return () =>
            window.clearTimeout(
                timer
            );

    }, [mensaje]);

    useEffect(() => {

        setPage(1);

    }, [
        search,
        filtroClase,
        filtroInstructor,
        pageSize
    ]);

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

    const instructoresPorId =
        useMemo(
            () =>
                new Map(
                    instructores.map(
                        (instructor) => [
                            instructor.id,
                            instructor
                        ]
                    )
                ),
            [instructores]
        );

    const horariosFiltrados =
        useMemo(() => {

            const term =
                search
                    .trim()
                    .toLowerCase();

            return horarios.filter(
                (horario) => {

                    const clase =
                        clasesPorId.get(
                            horario.claseId
                        );

                    const instructor =
                        instructoresPorId.get(
                            horario.instructorId
                        );

                    const texto =
                        [
                            clase?.nombre ?? "",
                            instructor?.nombre ?? "",
                            horario.fecha,
                            horario.horaInicio,
                            horario.horaFin
                        ]
                            .join(" ")
                            .toLowerCase();

                    const coincideTexto =
                        !term ||
                        texto.includes(term);

                    const coincideClase =
                        !filtroClase ||
                        horario.claseId ===
                        Number(filtroClase);

                    const coincideInstructor =
                        !filtroInstructor ||
                        horario.instructorId ===
                        Number(
                            filtroInstructor
                        );

                    return (
                        coincideTexto &&
                        coincideClase &&
                        coincideInstructor
                    );
                }
            );

        }, [
            horarios,
            search,
            filtroClase,
            filtroInstructor,
            clasesPorId,
            instructoresPorId
        ]);

    const totalPages =
        Math.max(
            1,
            Math.ceil(
                horariosFiltrados.length /
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

    const horariosVisibles =
        useMemo(() => {

            const inicio =
                (page - 1) *
                pageSize;

            return horariosFiltrados.slice(
                inicio,
                inicio + pageSize
            );

        }, [
            horariosFiltrados,
            page,
            pageSize
        ]);

    const cargando =
        cargandoHorarios ||
        cargandoCatalogos;

    const error =
        errorOperacion ||
        errorCatalogos ||
        errorHorarios;

    function nuevoHorario() {

        setHorarioIdEditar(null);
        setHorarioEditar(null);

        setMostrarFormulario(
            true
        );

        setErrorOperacion("");
        setErrorHorarios("");
        setMensaje("");
    }

    function editarHorario(
        id: number
    ) {

        if (
            cargandoDetalle ||
            guardando
        ) {
            return;
        }

        setErrorOperacion("");
        setMensaje("");

        setHorarioIdEditar(id);
    }

    async function guardarHorario(
        datos: HorarioRequest
    ) {

        if (guardando) {
            return;
        }

        setGuardando(true);
        setErrorOperacion("");

        try {

            if (horarioEditar) {

                const actualizado =
                    await horarioService
                        .actualizar(
                            horarioEditar.id,
                            datos
                        );

                setHorarios(
                    (anteriores) =>
                        anteriores.map(
                            (horario) =>
                                horario.id ===
                                actualizado.id
                                    ? actualizado
                                    : horario
                        )
                );

                setMensaje(
                    "Horario actualizado correctamente."
                );

            } else {

                const creado =
                    await horarioService
                        .crear(datos);

                setHorarios(
                    (anteriores) => [
                        creado,
                        ...anteriores
                    ]
                );

                setMensaje(
                    "Horario registrado correctamente."
                );
            }

            setHorarioIdEditar(
                null
            );

            setHorarioEditar(
                null
            );

            setMostrarFormulario(
                false
            );

        } catch (err) {

            setErrorOperacion(
                err instanceof Error
                    ? err.message
                    : "No se pudo guardar el horario."
            );

            throw err;

        } finally {

            setGuardando(false);

        }
    }

    function cancelarFormulario() {

        if (guardando) {
            return;
        }

        setHorarioIdEditar(null);
        setHorarioEditar(null);

        setMostrarFormulario(
            false
        );
    }

    return (
        <section className="horarios-page">

            <header className="horarios-header">

                <div>
                    <h1>
                        Gestión de Horarios
                    </h1>

                    <p>
                        Búsqueda, filtros,
                        relaciones y paginación.
                    </p>
                </div>

                <div className="module-toolbar__actions">

                    <Button
                        type="button"
                        variant="secondary"
                        disabled={
                            cargando ||
                            guardando ||
                            cargandoDetalle
                        }
                        onClick={reload}
                    >
                        Actualizar horarios
                    </Button>

                    <Button
                        type="button"
                        disabled={
                            cargando ||
                            guardando ||
                            cargandoDetalle
                        }
                        onClick={
                            nuevoHorario
                        }
                    >
                        + Nuevo horario
                    </Button>

                </div>
            </header>

            {mensaje && (
                <div
                    className="horarios-success"
                    role="status"
                >
                    {mensaje}
                </div>
            )}

            {error && (
                <div
                    className="horarios-error"
                    role="alert"
                >
                    {error}
                </div>
            )}

            {mostrarFormulario && (
                <HorarioForm
                    clases={clases}
                    instructores={
                        instructores
                    }
                    horarioEditar={
                        horarioEditar
                    }
                    onGuardar={
                        guardarHorario
                    }
                    onCancelar={
                        cancelarFormulario
                    }
                />
            )}

            <section className="filter-panel">

                <div className="filter-panel__grid">

                    <SearchInput
                        label="Buscar horario"
                        value={search}
                        placeholder={
                            "Clase, instructor o fecha"
                        }
                        onChange={
                            setSearch
                        }
                    />

                    <SelectFilter
                        label="Clase"
                        value={
                            filtroClase
                        }
                        options={[
                            {
                                value: "",
                                label:
                                    "Todas las clases"
                            },
                            ...clases.map(
                                (clase) => ({
                                    value:
                                        String(clase.id),

                                    label:
                                    clase.nombre
                                })
                            )
                        ]}
                        onChange={
                            setFiltroClase
                        }
                    />

                    <SelectFilter
                        label="Instructor"
                        value={
                            filtroInstructor
                        }
                        options={[
                            {
                                value: "",
                                label:
                                    "Todos los instructores"
                            },
                            ...instructores.map(
                                (instructor) => ({
                                    value:
                                        String(
                                            instructor.id
                                        ),

                                    label:
                                    instructor.nombre
                                })
                            )
                        ]}
                        onChange={
                            setFiltroInstructor
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
                {horariosVisibles.length} de{" "}
                {horariosFiltrados.length}
                {" "}resultado(s).
            </p>

            {cargando ? (

                <p>
                    Cargando información...
                </p>

            ) : horariosFiltrados.length === 0 ? (

                <EmptyState
                    title="No existen horarios"
                    description={
                        "No hay resultados que coincidan con la búsqueda y los filtros."
                    }
                />

            ) : (

                <>
                    <HorarioTable
                        horarios={
                            horariosVisibles
                        }
                        clases={clases}
                        instructores={
                            instructores
                        }
                        onEditar={
                            editarHorario
                        }
                        cargandoDetalle={
                            cargandoDetalle ||
                            guardando
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

        </section>
    );
}