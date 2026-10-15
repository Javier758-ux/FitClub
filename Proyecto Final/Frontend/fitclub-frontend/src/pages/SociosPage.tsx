import {
    useEffect,
    useMemo,
    useState
} from "react";

import SocioTable
    from "../components/SocioTable";

import SocioForm
    from "../components/SocioForm";

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
    useSocios
} from "../hooks/useSocios";

import {
    isAbortError
} from "../utils/isAbortError";

import type {
    SocioApi,
    SocioRequest
} from "../models/ApiModels";

import "../components/SociosCrud.css";

const BORRADO_HABILITADO =
    false;

type CampoBusqueda =
    | "todos"
    | "nombre"
    | "email"
    | "telefono";

export default function SociosPage() {

    const {
        data: socios,
        setData: setSocios,
        loading: cargando,
        error,
        setError,
        reload
    } = useSocios();

    const [
        socioIdEditar,
        setSocioIdEditar
    ] =
        useState<number | null>(
            null
        );

    const [
        socioEditar,
        setSocioEditar
    ] =
        useState<SocioApi | null>(
            null
        );

    const [
        mostrarFormulario,
        setMostrarFormulario
    ] = useState(false);

    const [
        cargandoDetalle,
        setCargandoDetalle
    ] = useState(false);

    const [
        guardando,
        setGuardando
    ] = useState(false);

    const [
        eliminandoId,
        setEliminandoId
    ] =
        useState<number | null>(
            null
        );

    const [
        pendingDelete,
        setPendingDelete
    ] =
        useState<SocioApi | null>(
            null
        );

    const [
        mensaje,
        setMensaje
    ] = useState("");

    const [
        search,
        setSearch
    ] = useState("");

    const [
        campoBusqueda,
        setCampoBusqueda
    ] =
        useState<CampoBusqueda>(
            "todos"
        );

    const [
        page,
        setPage
    ] = useState(1);

    const [
        pageSize,
        setPageSize
    ] = useState(10);

    useEffect(() => {

        if (
            socioIdEditar === null
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

                setError("");

                const socio =
                    await socioService.buscarPorId(
                        socioIdEditar!,
                        controller.signal
                    );

                if (!ignore) {
                    setSocioEditar(
                        socio
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
                    setError(
                        err instanceof Error
                            ? err.message
                            : "No se pudo cargar el socio."
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

    }, [
        socioIdEditar,
        setError
    ]);

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

    /*
     * Regla de la Guia 09:
     * cambiar busqueda, filtro o tamaño
     * vuelve a pagina 1.
     */
    useEffect(() => {
        setPage(1);
    }, [
        search,
        campoBusqueda,
        pageSize
    ]);

    const sociosFiltrados =
        useMemo(() => {

            const term =
                search
                    .trim()
                    .toLowerCase();

            if (!term) {
                return socios;
            }

            return socios.filter(
                (socio) => {

                    const nombre =
                        socio.nombre
                            .toLowerCase();

                    const email =
                        socio.email
                            .toLowerCase();

                    const telefono =
                        socio.telefono
                            .toLowerCase();

                    if (
                        campoBusqueda ===
                        "nombre"
                    ) {
                        return nombre.includes(
                            term
                        );
                    }

                    if (
                        campoBusqueda ===
                        "email"
                    ) {
                        return email.includes(
                            term
                        );
                    }

                    if (
                        campoBusqueda ===
                        "telefono"
                    ) {
                        return telefono.includes(
                            term
                        );
                    }

                    return (
                        nombre.includes(term) ||
                        email.includes(term) ||
                        telefono.includes(term)
                    );
                }
            );

        }, [
            socios,
            search,
            campoBusqueda
        ]);

    const totalPages =
        Math.max(
            1,
            Math.ceil(
                sociosFiltrados.length /
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

    const sociosVisibles =
        useMemo(() => {

            const inicio =
                (page - 1) *
                pageSize;

            return sociosFiltrados.slice(
                inicio,
                inicio + pageSize
            );

        }, [
            sociosFiltrados,
            page,
            pageSize
        ]);

    const ocupada =
        guardando ||
        cargandoDetalle ||
        eliminandoId !== null;

    function nuevoSocio() {

        setSocioIdEditar(null);
        setSocioEditar(null);

        setMostrarFormulario(
            true
        );

        setError("");
        setMensaje("");
    }

    function editarSocio(
        id: number
    ) {

        if (ocupada) {
            return;
        }

        setMensaje("");
        setError("");

        setSocioIdEditar(id);
    }

    async function guardarSocio(
        datos: SocioRequest
    ) {

        if (guardando) {
            return;
        }

        setGuardando(true);
        setError("");

        try {

            if (socioEditar) {

                const actualizado =
                    await socioService
                        .actualizar(
                            socioEditar.id,
                            datos
                        );

                setSocios(
                    (actuales) =>
                        actuales.map(
                            (socio) =>
                                socio.id ===
                                actualizado.id
                                    ? actualizado
                                    : socio
                        )
                );

                setMensaje(
                    "Socio actualizado correctamente."
                );

            } else {

                const creado =
                    await socioService
                        .crear(datos);

                setSocios(
                    (actuales) => [
                        creado,
                        ...actuales
                    ]
                );

                setMensaje(
                    "Socio registrado correctamente."
                );
            }

            setSocioIdEditar(null);
            setSocioEditar(null);

            setMostrarFormulario(
                false
            );

        } catch (err) {

            setError(
                err instanceof Error
                    ? err.message
                    : "No se pudo guardar el socio."
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

        setSocioIdEditar(null);
        setSocioEditar(null);

        setMostrarFormulario(
            false
        );
    }

    /*
     * Ya no ejecutamos DELETE
     * directamente.
     *
     * Primero guardamos la entidad
     * pendiente y luego ConfirmDialog
     * pedira confirmacion.
     */
    function solicitarEliminar(
        socio: SocioApi
    ) {

        if (!BORRADO_HABILITADO) {

            setError(
                "El backend todavía no implementa DELETE para socios."
            );

            return;
        }

        setPendingDelete(
            socio
        );
    }

    async function confirmarEliminar() {

        if (!pendingDelete) {
            return;
        }

        const socio =
            pendingDelete;

        setEliminandoId(
            socio.id
        );

        setError("");
        setMensaje("");

        try {

            await socioService.eliminar(
                socio.id
            );

            setSocios(
                (actuales) =>
                    actuales.filter(
                        (item) =>
                            item.id !== socio.id
                    )
            );

            setMensaje(
                "Socio eliminado correctamente."
            );

            setPendingDelete(
                null
            );

        } catch (err) {

            setError(
                err instanceof Error
                    ? err.message
                    : "No se pudo eliminar el socio."
            );

        } finally {

            setEliminandoId(null);

        }
    }

    return (
        <section className="socios-crud">

            <header className="socios-crud__header">

                <div>
                    <h1>
                        Gestión de Socios
                    </h1>

                    <p>
                        Consulta, registro,
                        edición, búsqueda y paginación.
                    </p>
                </div>

                <div className="module-toolbar__actions">

                    <Button
                        type="button"
                        variant="secondary"
                        disabled={
                            cargando ||
                            ocupada
                        }
                        onClick={reload}
                    >
                        Actualizar lista
                    </Button>

                    <Button
                        type="button"
                        disabled={
                            cargando ||
                            ocupada
                        }
                        onClick={
                            nuevoSocio
                        }
                    >
                        + Nuevo socio
                    </Button>

                </div>
            </header>

            {mensaje && (
                <div
                    className="socios-crud__success"
                    role="status"
                >
                    {mensaje}
                </div>
            )}

            {error && (
                <div
                    className="socios-crud__error"
                    role="alert"
                >
                    {error}
                </div>
            )}

            {mostrarFormulario && (
                <SocioForm
                    key={
                        socioEditar?.id ??
                        "nuevo"
                    }
                    socioEditar={
                        socioEditar
                    }
                    onGuardar={
                        guardarSocio
                    }
                    onCancelar={
                        cancelarFormulario
                    }
                />
            )}

            <section className="filter-panel">

                <div className="filter-panel__grid">

                    <SearchInput
                        label="Buscar socio"
                        value={search}
                        placeholder={
                            "Nombre, correo o teléfono"
                        }
                        onChange={setSearch}
                    />

                    <SelectFilter
                        label="Buscar en"
                        value={
                            campoBusqueda
                        }
                        options={[
                            {
                                value: "todos",
                                label:
                                    "Todos los campos"
                            },
                            {
                                value: "nombre",
                                label: "Nombre"
                            },
                            {
                                value: "email",
                                label: "Correo"
                            },
                            {
                                value: "telefono",
                                label: "Teléfono"
                            }
                        ]}
                        onChange={(value) =>
                            setCampoBusqueda(
                                value as CampoBusqueda
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
                {sociosVisibles.length} de{" "}
                {sociosFiltrados.length}
                {" "}resultado(s).
            </p>

            {cargando ? (

                <p>
                    Cargando socios...
                </p>

            ) : sociosFiltrados.length === 0 ? (

                <EmptyState
                    title="No se encontraron socios"
                    description={
                        "Prueba con otro término o filtro de búsqueda."
                    }
                />

            ) : (

                <>
                    <SocioTable
                        socios={
                            sociosVisibles
                        }
                        onEditar={
                            editarSocio
                        }
                        onEliminar={
                            solicitarEliminar
                        }
                        cargandoDetalle={
                            ocupada
                        }
                        eliminandoId={
                            eliminandoId
                        }
                        permiteEliminar={
                            BORRADO_HABILITADO
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
                    pendingDelete !== null
                }
                title="Eliminar socio"
                message={
                    pendingDelete
                        ? `¿Deseas eliminar a ${pendingDelete.nombre}?`
                        : ""
                }
                confirmLabel="Eliminar"
                confirming={
                    eliminandoId !== null
                }
                onConfirm={() =>
                    void confirmarEliminar()
                }
                onCancel={() =>
                    setPendingDelete(null)
                }
            />

        </section>
    );
}