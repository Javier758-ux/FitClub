import {
    useEffect,
    useMemo,
    useState
} from "react";

import {
    MetricCard
} from "../components/ui/MetricCard";

import {
    Button
} from "../components/ui/Button";

import {
    EmptyState
} from "../components/ui/EmptyState";

import {
    useClases
} from "../hooks/useClases";

import {
    useHorarios
} from "../hooks/useHorarios";

import {
    useInstructores
} from "../hooks/useInstructores";

import {
    usePlanes
} from "../hooks/usePlanes";

import {
    authService
} from "../services/authService";

import type {
    UsuarioActual
} from "../services/authService";

import {
    reporteService
} from "../services/reporteService";

import {
    isAbortError
} from "../utils/isAbortError";

import type {
    HorarioApi,
    ReporteOcupacionApi
} from "../models/ApiModels";

import "./Dashboard.css";

function fechaHoraHorario(
    horario: HorarioApi
): number {

    return new Date(
        `${horario.fecha}T${horario.horaInicio}`
    ).getTime();
}

export default function DashboardPage() {

    const clases =
        useClases();

    const horarios =
        useHorarios();

    const instructores =
        useInstructores();

    const planes =
        usePlanes();

    const [
        usuario,
        setUsuario
    ] =
        useState<UsuarioActual | null>(
            null
        );

    const [
        reporte,
        setReporte
    ] =
        useState<ReporteOcupacionApi | null>(
            null
        );

    const [
        cargandoReporte,
        setCargandoReporte
    ] =
        useState(false);

    const [
        errorReporte,
        setErrorReporte
    ] =
        useState("");

    const [
        versionReporte,
        setVersionReporte
    ] =
        useState(0);

    useEffect(() => {

        let activo =
            true;

        authService
            .obtenerUsuarioActual()
            .then(
                (actual) => {

                    if (activo) {

                        setUsuario(
                            actual
                        );
                    }
                }
            )
            .catch(
                (err: unknown) => {

                    if (activo) {

                        setErrorReporte(
                            err instanceof Error
                                ? err.message
                                : "No se pudo obtener el usuario actual."
                        );
                    }
                }
            );

        return () => {
            activo = false;
        };

    }, []);

    /*
     * Encontramos el horario futuro
     * más cercano.
     */
    const proximoHorario =
        useMemo(() => {

            const ahora =
                Date.now();

            const futuros =
                horarios.data
                    .filter(
                        (horario) =>
                            fechaHoraHorario(
                                horario
                            ) >= ahora
                    )
                    .sort(
                        (a, b) =>
                            fechaHoraHorario(a) -
                            fechaHoraHorario(b)
                    );

            return (
                futuros[0] ??
                null
            );

        }, [
            horarios.data
        ]);

    /*
     * SOCIO no tiene permiso
     * sobre /api/reportes.
     */
    useEffect(() => {

        if (
            !usuario ||
            usuario.rol ===
            "SOCIO" ||
            !proximoHorario
        ) {

            setReporte(
                null
            );

            return;
        }

        const controller =
            new AbortController();

        async function cargarReporte() {

            try {

                setCargandoReporte(
                    true
                );

                setErrorReporte(
                    ""
                );

                const resultado =
                    await reporteService
                        .obtenerOcupacionPorHorario(
                            proximoHorario!.id,
                            controller.signal
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

                    setErrorReporte(
                        err instanceof Error
                            ? err.message
                            : "No se pudo obtener la ocupación del próximo horario."
                    );
                }

            } finally {

                if (
                    !controller.signal.aborted
                ) {

                    setCargandoReporte(
                        false
                    );
                }
            }
        }

        void cargarReporte();

        return () => {

            controller.abort();

        };

    }, [
        usuario,
        proximoHorario,
        versionReporte
    ]);

    const loading =
        clases.loading ||
        horarios.loading ||
        instructores.loading ||
        planes.loading;

    const error =
        clases.error ||
        horarios.error ||
        instructores.error ||
        planes.error;

    const metricas = {

        clases:
        clases.data.length,

        horarios:
        horarios.data.length,

        instructores:
        instructores.data.length,

        planes:
        planes.data.length

    };

    function actualizarDashboard() {

        clases.reload();
        horarios.reload();
        instructores.reload();
        planes.reload();

        setVersionReporte(
            (actual) =>
                actual + 1
        );
    }

    return (
        <section className="dashboard-page">

            <header className="dashboard-header">

                <div>

                    <h1>
                        Dashboard FitClub
                    </h1>

                    <p>
                        Resumen operativo de la
                        información principal
                        del sistema.
                    </p>

                </div>

                <Button
                    type="button"
                    variant="secondary"
                    disabled={
                        loading ||
                        cargandoReporte
                    }
                    onClick={
                        actualizarDashboard
                    }
                >
                    Actualizar dashboard
                </Button>

            </header>

            {error && (

                <div
                    className="dashboard-error"
                    role="alert"
                >
                    {error}
                </div>

            )}

            {errorReporte && (

                <div
                    className="dashboard-error"
                    role="alert"
                >
                    {errorReporte}
                </div>

            )}

            {loading ? (

                <p>
                    Cargando dashboard...
                </p>

            ) : (

                <>

                    <section>

                        <h2 className="dashboard-section-title">
                            Catálogos
                        </h2>

                        <div className="dashboard-grid">

                            <MetricCard
                                label="Clases"
                                value={
                                    metricas.clases
                                }
                                helper={
                                    "Clases disponibles en FitClub"
                                }
                            />

                            <MetricCard
                                label="Horarios"
                                value={
                                    metricas.horarios
                                }
                                helper={
                                    "Horarios programados"
                                }
                            />

                            <MetricCard
                                label="Instructores"
                                value={
                                    metricas.instructores
                                }
                                helper={
                                    "Instructores registrados"
                                }
                            />

                            <MetricCard
                                label="Planes"
                                value={
                                    metricas.planes
                                }
                                helper={
                                    "Planes disponibles"
                                }
                            />

                        </div>

                    </section>

                    {
                        usuario?.rol !==
                        "SOCIO" && (

                            <section>

                                <h2 className="dashboard-section-title">
                                    Ocupación del próximo horario
                                </h2>

                                {!proximoHorario ? (

                                    <EmptyState
                                        title="No hay próximos horarios"
                                        description={
                                            "Programa un horario futuro para visualizar su ocupación."
                                        }
                                    />

                                ) : cargandoReporte ? (

                                    <p>
                                        Calculando ocupación...
                                    </p>

                                ) : reporte ? (

                                    <>

                                        <div className="dashboard-grid">

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
                                                    "Cupos actualmente reservados"
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

                                        <div className="dashboard-occupancy-detail">

                                            Próximo horario:{" "}
                                            {
                                                proximoHorario.fecha
                                            }

                                            {" — "}

                                            {
                                                proximoHorario.horaInicio.slice(
                                                    0,
                                                    5
                                                )
                                            }

                                            {" a "}

                                            {
                                                proximoHorario.horaFin.slice(
                                                    0,
                                                    5
                                                )
                                            }

                                        </div>

                                    </>

                                ) : null}

                            </section>

                        )}

                    {
                        usuario?.rol ===
                        "SOCIO" && (

                            <section className="dashboard-info">

                                <h2>
                                    Panel del socio
                                </h2>

                                <p>
                                    Puedes consultar clases,
                                    horarios, planes y gestionar
                                    tus reservas desde el menú
                                    principal.
                                </p>

                            </section>

                        )}

                </>

            )}

            <section className="dashboard-info">

                <h2>
                    Cómo se calcula la ocupación
                </h2>

                <p>
                    El backend de FitClub calcula
                    la ocupación usando las reservas
                    activas del horario y su cupo máximo.
                </p>

                <p>
                    La fórmula actual es:
                    reservas activas ÷ cupo máximo × 100.
                    El registro de asistencia se almacena
                    por separado y no cambia directamente
                    este porcentaje.
                </p>

            </section>

        </section>
    );
}