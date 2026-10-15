import {
    useEffect,
    useMemo,
    useState
} from "react";

import {
    Button
} from "../components/ui/Button";

import {
    EmptyState
} from "../components/ui/EmptyState";

import {
    MetricCard
} from "../components/ui/MetricCard";

import {
    SelectFilter
} from "../components/ui/SelectFilter";

import {
    useAuth
} from "../auth/AuthContext";

import {
    claseService
} from "../services/claseService";

import {
    horarioService
} from "../services/horarioService";

import {
    instructorService
} from "../services/instructorService";

import {
    reporteService
} from "../services/reporteService";

import {
    isAbortError
} from "../utils/isAbortError";

import type {
    ClaseApi,
    HorarioApi,
    InstructorApi,
    ReporteOcupacionApi
} from "../models/ApiModels";

import "./Reportes.css";

function fechaHoraHorario(
    horario: HorarioApi
): number {

    return new Date(
        `${horario.fecha}T${horario.horaInicio}`
    ).getTime();
}

export default function ReportesPage() {

    const {
        usuario
    } = useAuth();

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
        instructores,
        setInstructores
    ] =
        useState<InstructorApi[]>([]);

    const [
        filtroClase,
        setFiltroClase
    ] =
        useState("");

    const [
        horarioId,
        setHorarioId
    ] =
        useState("");

    const [
        reporte,
        setReporte
    ] =
        useState<ReporteOcupacionApi | null>(
            null
        );

    const [
        cargando,
        setCargando
    ] =
        useState(true);

    const [
        cargandoReporte,
        setCargandoReporte
    ] =
        useState(false);

    const [
        error,
        setError
    ] =
        useState("");

    useEffect(() => {

        if (!usuario) {
            return;
        }

        let activo =
            true;

        const controller =
            new AbortController();

        async function cargar() {

            try {

                setCargando(true);
                setError("");

                const [
                    listaHorarios,
                    paginaClases,
                    paginaInstructores
                ] =
                    await Promise.all([

                        horarioService.listar(
                            controller.signal
                        ),

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

                if (!activo) {
                    return;
                }

                const ordenados = [
                    ...listaHorarios
                ].sort(
                    (a, b) =>
                        fechaHoraHorario(a) -
                        fechaHoraHorario(b)
                );

                setHorarios(
                    ordenados
                );

                setClases(
                    paginaClases.contenido
                );

                setInstructores(
                    paginaInstructores.contenido
                );

                const ahora =
                    Date.now();

                const primeroFuturo =
                    ordenados.find(
                        (horario) =>
                            fechaHoraHorario(
                                horario
                            ) >= ahora
                    ) ??
                    ordenados[0];

                if (primeroFuturo) {

                    setHorarioId(
                        String(
                            primeroFuturo.id
                        )
                    );
                }

            } catch (err) {

                if (
                    activo &&
                    !isAbortError(err)
                ) {

                    setError(
                        err instanceof Error
                            ? err.message
                            : "No se pudo cargar el módulo de reportes."
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

        void cargar();

        return () => {

            activo = false;

            controller.abort();
        };

    }, [usuario]);

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
        useMemo(
            () =>
                horarios.filter(
                    (horario) =>
                        !filtroClase ||
                        horario.claseId ===
                        Number(
                            filtroClase
                        )
                ),
            [
                horarios,
                filtroClase
            ]
        );

    useEffect(() => {

        if (
            !horarioId ||
            horariosFiltrados.some(
                (horario) =>
                    horario.id ===
                    Number(
                        horarioId
                    )
            )
        ) {
            return;
        }

        setHorarioId(
            horariosFiltrados[0]
                ? String(
                    horariosFiltrados[0].id
                )
                : ""
        );

    }, [
        horarioId,
        horariosFiltrados
    ]);

    async function consultarReporte(
        id: number,
        signal?: AbortSignal
    ) {

        setCargandoReporte(
            true
        );

        setError("");

        try {

            const resultado =
                await reporteService
                    .obtenerOcupacionPorHorario(
                        id,
                        signal
                    );

            setReporte(
                resultado
            );

        } catch (err) {

            if (
                !isAbortError(err)
            ) {

                setReporte(
                    null
                );

                setError(
                    err instanceof Error
                        ? err.message
                        : "No se pudo obtener el reporte de ocupación."
                );
            }

        } finally {

            if (
                !signal?.aborted
            ) {

                setCargandoReporte(
                    false
                );
            }
        }
    }

    useEffect(() => {

        if (
            usuario?.rol ===
            "SOCIO" ||
            !horarioId
        ) {

            setReporte(
                null
            );

            return;
        }

        const controller =
            new AbortController();

        void consultarReporte(
            Number(
                horarioId
            ),
            controller.signal
        );

        return () => {

            controller.abort();

        };

    }, [
        horarioId,
        usuario?.rol
    ]);

    const horarioSeleccionado =
        horarios.find(
            (horario) =>
                horario.id ===
                Number(
                    horarioId
                )
        );

    const instructorSeleccionado =
        horarioSeleccionado
            ? instructoresPorId.get(
                horarioSeleccionado.instructorId
            )
            : undefined;

    if (cargando) {

        return (
            <section className="reportes-page">

                <h1>
                    Reportes
                </h1>

                <p>
                    Cargando información...
                </p>

            </section>
        );
    }

    if (
        usuario?.rol ===
        "SOCIO"
    ) {

        return (
            <section className="reportes-page">

                <h1>
                    Reportes
                </h1>

                <EmptyState
                    title="Módulo operativo"
                    description={
                        "Los reportes de ocupación están disponibles para Administración, Recepción e Instructores."
                    }
                />

            </section>
        );
    }

    return (
        <section className="reportes-page">

            <header className="reportes-header">

                <div>

                    <h1>
                        Reporte de Ocupación
                    </h1>

                    <p>
                        Consulta el cupo y
                        las reservas activas
                        de cada horario.
                    </p>

                </div>

                <Button
                    type="button"
                    variant="secondary"
                    loading={
                        cargandoReporte
                    }
                    disabled={
                        !horarioId
                    }
                    onClick={() =>
                        void consultarReporte(
                            Number(
                                horarioId
                            )
                        )
                    }
                >
                    Actualizar reporte
                </Button>

            </header>

            {error && (

                <div
                    className="reportes-error"
                    role="alert"
                >
                    {error}
                </div>

            )}

            <section className="filter-panel">

                <div className="filter-panel__grid">

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
                                        String(
                                            clase.id
                                        ),

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
                        label="Horario"
                        value={
                            horarioId
                        }
                        options={[
                            {
                                value: "",
                                label:
                                    "Seleccionar horario"
                            },

                            ...horariosFiltrados.map(
                                (horario) => ({

                                    value:
                                        String(
                                            horario.id
                                        ),

                                    label:
                                        `${
                                            clasesPorId.get(
                                                horario.claseId
                                            )?.nombre ??
                                            `Clase #${horario.claseId}`
                                        } — ${horario.fecha} — ${
                                            horario.horaInicio.slice(
                                                0,
                                                5
                                            )
                                        }`

                                })
                            )
                        ]}
                        onChange={
                            setHorarioId
                        }
                    />

                </div>

            </section>

            {
                horarios.length === 0
                    ? (

                        <EmptyState
                            title="No hay horarios"
                            description={
                                "Primero deben existir horarios para calcular ocupación."
                            }
                        />

                    )
                    : !horarioId
                        ? (

                            <EmptyState
                                title="Selecciona un horario"
                                description={
                                    "Elige una clase y un horario para consultar su ocupación."
                                }
                            />

                        )
                        : cargandoReporte
                            ? (

                                <p>
                                    Calculando ocupación...
                                </p>

                            )
                            : reporte
                                ? (

                                    <>

                                        <div className="reportes-grid">

                                            <MetricCard
                                                label="Cupo máximo"
                                                value={
                                                    reporte.cupoMaximo
                                                }
                                                helper={
                                                    reporte.clase
                                                }
                                            />

                                            <MetricCard
                                                label="Reservas activas"
                                                value={
                                                    reporte.reservasActivas
                                                }
                                                helper={
                                                    "Reservas que ocupan cupo"
                                                }
                                            />

                                            <MetricCard
                                                label="Cupos disponibles"
                                                value={
                                                    reporte.cuposDisponibles
                                                }
                                                helper={
                                                    "Espacios restantes"
                                                }
                                            />

                                            <MetricCard
                                                label="Ocupación %"
                                                value={
                                                    Math.round(
                                                        reporte.porcentajeOcupacion
                                                    )
                                                }
                                                helper={
                                                    `${reporte.porcentajeOcupacion.toFixed(1)}% de ocupación`
                                                }
                                            />

                                        </div>

                                        <section className="reportes-detail">

                                            <h2>
                                                Detalle del horario
                                            </h2>

                                            <div className="reportes-detail-grid">

                                                <div className="reportes-detail-item">

                                                    <span>
                                                        Horario ID
                                                    </span>

                                                    <strong>
                                                        {
                                                            reporte.horarioId
                                                        }
                                                    </strong>

                                                </div>

                                                <div className="reportes-detail-item">

                                                    <span>
                                                        Clase
                                                    </span>

                                                    <strong>
                                                        {
                                                            reporte.clase
                                                        }
                                                    </strong>

                                                </div>

                                                <div className="reportes-detail-item">

                                                    <span>
                                                        Fecha
                                                    </span>

                                                    <strong>
                                                        {
                                                            horarioSeleccionado?.fecha ??
                                                            "—"
                                                        }
                                                    </strong>

                                                </div>

                                                <div className="reportes-detail-item">

                                                    <span>
                                                        Horario
                                                    </span>

                                                    <strong>

                                                        {
                                                            horarioSeleccionado
                                                                ? `${horarioSeleccionado.horaInicio.slice(0, 5)} - ${horarioSeleccionado.horaFin.slice(0, 5)}`
                                                                : "—"
                                                        }

                                                    </strong>

                                                </div>

                                                <div className="reportes-detail-item">

                                                    <span>
                                                        Instructor
                                                    </span>

                                                    <strong>
                                                        {
                                                            instructorSeleccionado?.nombre ??
                                                            "—"
                                                        }
                                                    </strong>

                                                </div>

                                            </div>

                                            <div
                                                className="reportes-progress"
                                                aria-label={
                                                    `Ocupación ${reporte.porcentajeOcupacion.toFixed(1)} por ciento`
                                                }
                                            >

                                                <div
                                                    className="reportes-progress__bar"
                                                    style={{
                                                        width:
                                                            `${
                                                                Math.min(
                                                                    Math.max(
                                                                        reporte.porcentajeOcupacion,
                                                                        0
                                                                    ),
                                                                    100
                                                                )
                                                            }%`
                                                    }}
                                                />

                                            </div>

                                        </section>

                                        <p className="reportes-note">

                                            En el backend actual,
                                            la ocupación se calcula
                                            como reservas activas ÷
                                            cupo máximo × 100.

                                            La asistencia no modifica
                                            directamente este porcentaje.

                                        </p>

                                    </>

                                )
                                : null
            }

        </section>
    );
}