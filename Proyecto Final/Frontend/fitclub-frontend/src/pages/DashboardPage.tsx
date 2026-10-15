import {
    useEffect,
    useMemo,
    useState
} from "react";

import {
    useAuth
} from "../auth/AuthContext";

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

import type {
    Membresia
} from "../models/Membresia";

import type {
    HorarioApi,
    ReporteOcupacionApi
} from "../models/ApiModels";

import {
    membresiaService
} from "../services/membresiaService";

import {
    reporteService
} from "../services/reporteService";

import {
    isAbortError
} from "../utils/isAbortError";

import "./Dashboard.css";

function fechaHoraHorario(
    horario: HorarioApi
): number {

    return new Date(
        `${horario.fecha}T${horario.horaInicio}`
    ).getTime();
}

function estaProximaAVencer(
    membresia: Membresia
): boolean {

    if (
        membresia.estado !==
        "ACTIVA"
    ) {
        return false;
    }

    const ahora =
        new Date();

    const fin =
        new Date(
            `${membresia.fechaFin}T23:59:59`
        );

    const diferencia =
        fin.getTime() -
        ahora.getTime();

    const sieteDias =
        7 *
        24 *
        60 *
        60 *
        1000;

    return (
        diferencia >= 0 &&
        diferencia <=
        sieteDias
    );
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

    const {
        usuario
    } = useAuth();

    const [
        reporte,
        setReporte
    ] =
        useState<
            ReporteOcupacionApi |
            null
        >(
            null
        );

    const [
        membresias,
        setMembresias
    ] =
        useState<Membresia[]>(
            []
        );

    const [
        cargandoReporte,
        setCargandoReporte
    ] =
        useState(false);

    const [
        cargandoMembresias,
        setCargandoMembresias
    ] =
        useState(false);

    const [
        errorReporte,
        setErrorReporte
    ] =
        useState("");

    const [
        errorMembresias,
        setErrorMembresias
    ] =
        useState("");

    const [
        versionReporte,
        setVersionReporte
    ] =
        useState(0);

    const [
        versionMembresias,
        setVersionMembresias
    ] =
        useState(0);

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
                            fechaHoraHorario(
                                a
                            ) -
                            fechaHoraHorario(
                                b
                            )
                    );

            return (
                futuros[0] ??
                null
            );

        }, [
            horarios.data
        ]);

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
                    !isAbortError(
                        err
                    )
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

    useEffect(() => {

        if (!usuario) {
            return;
        }

        if (
            usuario.rol ===
            "INSTRUCTOR"
        ) {

            setMembresias(
                []
            );

            setCargandoMembresias(
                false
            );

            setErrorMembresias(
                ""
            );

            return;
        }

        const controller =
            new AbortController();

        async function cargarVigencias() {

            try {

                setCargandoMembresias(
                    true
                );

                setErrorMembresias(
                    ""
                );

                const lista =
                    usuario!.rol ===
                    "SOCIO"
                        ? await membresiaService
                            .listarMias(
                                controller.signal
                            )
                        : await membresiaService
                            .listar(
                                undefined,
                                undefined,
                                controller.signal
                            );

                setMembresias(
                    lista
                );

            } catch (err) {

                if (
                    !isAbortError(
                        err
                    )
                ) {

                    setMembresias(
                        []
                    );

                    setErrorMembresias(
                        err instanceof Error
                            ? err.message
                            : "No se pudieron cargar las vigencias de membresías."
                    );
                }

            } finally {

                if (
                    !controller.signal.aborted
                ) {

                    setCargandoMembresias(
                        false
                    );
                }
            }
        }

        void cargarVigencias();

        return () => {

            controller.abort();

        };

    }, [
        usuario,
        versionMembresias
    ]);

    const resumenMembresias =
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
                ).length,

                proximasAVencer:
                membresias.filter(
                    estaProximaAVencer
                ).length

            }),
            [
                membresias
            ]
        );

    const loading =
        clases.loading ||
        horarios.loading ||
        instructores.loading ||
        planes.loading ||
        cargandoMembresias;

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

        setVersionMembresias(
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

            {errorMembresias && (

                <div
                    className="dashboard-error"
                    role="alert"
                >
                    {errorMembresias}
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
                        (
                            usuario?.rol ===
                            "ADMINISTRADOR" ||
                            usuario?.rol ===
                            "RECEPCION"
                        ) && (

                            <section>

                                <h2 className="dashboard-section-title">
                                    Vigencias de membresías
                                </h2>

                                <div className="dashboard-grid">

                                    <MetricCard
                                        label="Activas"
                                        value={
                                            resumenMembresias.activas
                                        }
                                        helper="Membresías vigentes"
                                    />

                                    <MetricCard
                                        label="Vencidas"
                                        value={
                                            resumenMembresias.vencidas
                                        }
                                        helper="Vigencia finalizada"
                                    />

                                    <MetricCard
                                        label="Suspendidas"
                                        value={
                                            resumenMembresias.suspendidas
                                        }
                                        helper="Temporalmente inactivas"
                                    />

                                    <MetricCard
                                        label="Próximas a vencer"
                                        value={
                                            resumenMembresias.proximasAVencer
                                        }
                                        helper="Dentro de los próximos 7 días"
                                    />

                                    <MetricCard
                                        label="Canceladas"
                                        value={
                                            resumenMembresias.canceladas
                                        }
                                        helper="Finalizadas manualmente"
                                    />

                                </div>

                            </section>

                        )
                    }

                    {
                        usuario?.rol ===
                        "SOCIO" && (

                            <section>

                                <h2 className="dashboard-section-title">
                                    Mi membresía
                                </h2>

                                <div className="dashboard-grid">

                                    <MetricCard
                                        label="Activas"
                                        value={
                                            resumenMembresias.activas
                                        }
                                        helper="Membresías vigentes"
                                    />

                                    <MetricCard
                                        label="Próximas a vencer"
                                        value={
                                            resumenMembresias.proximasAVencer
                                        }
                                        helper="Dentro de los próximos 7 días"
                                    />

                                    <MetricCard
                                        label="Vencidas"
                                        value={
                                            resumenMembresias.vencidas
                                        }
                                        helper="Membresías finalizadas por vigencia"
                                    />

                                </div>

                                <section className="dashboard-info">

                                    <h2>
                                        Estado de mi membresía
                                    </h2>

                                    <p>

                                        {
                                            resumenMembresias.activas >
                                            0
                                                ? "Tienes una membresía activa y puedes reservar clases sujetas a las reglas de cupo y horario."
                                                : "Actualmente no tienes una membresía activa. Las clases restringidas no podrán reservarse hasta contar con una membresía vigente."
                                        }

                                    </p>

                                </section>

                            </section>

                        )
                    }

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

                        )
                    }

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