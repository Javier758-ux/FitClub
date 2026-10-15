import {
    useMemo,
    useState
} from "react";

import type {
    FormEvent
} from "react";

import type {
    AsistenciaApi,
    AsistenciaRequest,
    ClaseApi,
    HorarioApi,
    ReservaApi,
    SocioApi
} from "../models/ApiModels";

import {
    Button
} from "./ui/Button";

import "./Forms.css";

interface AsistenciaFormProps {
    reservas: ReservaApi[];
    asistencias: AsistenciaApi[];
    socios: SocioApi[];
    horarios: HorarioApi[];
    clases: ClaseApi[];

    onGuardar: (
        datos: AsistenciaRequest
    ) => Promise<void>;

    onCancelar: () => void;
}

export default function AsistenciaForm({
                                           reservas,
                                           asistencias,
                                           socios,
                                           horarios,
                                           clases,
                                           onGuardar,
                                           onCancelar
                                       }: AsistenciaFormProps) {

    const [
        reservaClaseId,
        setReservaClaseId
    ] = useState("");

    const [
        presente,
        setPresente
    ] = useState("true");

    const [
        guardando,
        setGuardando
    ] = useState(false);

    const [
        error,
        setError
    ] = useState("");

    const asistenciasPorReserva =
        useMemo(
            () =>
                new Set(
                    asistencias.map(
                        (asistencia) =>
                            asistencia.reservaClaseId
                    )
                ),
            [asistencias]
        );

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

    const horariosPorId =
        useMemo(
            () =>
                new Map(
                    horarios.map(
                        (horario) => [
                            horario.id,
                            horario
                        ]
                    )
                ),
            [horarios]
        );

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

    /*
     * Solo mostramos reservas ACTIVAS
     * que todavía no tienen asistencia.
     */
    const reservasDisponibles =
        useMemo(
            () =>
                reservas.filter(
                    (reserva) =>
                        reserva.estado ===
                        "ACTIVA" &&
                        !asistenciasPorReserva.has(
                            reserva.id
                        )
                ),
            [
                reservas,
                asistenciasPorReserva
            ]
        );

    async function guardar(
        evento:
        FormEvent<HTMLFormElement>
    ) {

        evento.preventDefault();

        const reservaId =
            Number(reservaClaseId);

        if (
            !reservaClaseId ||
            !reservasDisponibles.some(
                (reserva) =>
                    reserva.id ===
                    reservaId
            )
        ) {

            setError(
                "Selecciona una reserva activa válida."
            );

            return;
        }

        setGuardando(true);
        setError("");

        try {

            await onGuardar({
                reservaClaseId:
                reservaId,

                presente:
                    presente === "true"
            });

        } catch (err) {

            setError(
                err instanceof Error
                    ? err.message
                    : "No se pudo registrar la asistencia."
            );

        } finally {

            setGuardando(false);

        }
    }

    return (
        <section className="entity-form">

            <h2>
                Registrar asistencia
            </h2>

            <form
                onSubmit={guardar}
                noValidate
            >

                <div className="form-grid">

                    <div className="form-field">

                        <label htmlFor="asistencia-reserva">
                            Reserva *
                        </label>

                        <select
                            id="asistencia-reserva"
                            value={
                                reservaClaseId
                            }
                            disabled={
                                guardando
                            }
                            onChange={(e) => {

                                setReservaClaseId(
                                    e.target.value
                                );

                                setError("");
                            }}
                        >

                            <option value="">
                                Seleccionar reserva
                            </option>

                            {reservasDisponibles.map(
                                (reserva) => {

                                    const socio =
                                        sociosPorId.get(
                                            reserva.socioId
                                        );

                                    const horario =
                                        horariosPorId.get(
                                            reserva.horarioClaseId
                                        );

                                    const clase =
                                        horario
                                            ? clasesPorId.get(
                                                horario.claseId
                                            )
                                            : undefined;

                                    return (
                                        <option
                                            key={
                                                reserva.id
                                            }
                                            value={
                                                String(
                                                    reserva.id
                                                )
                                            }
                                        >

                                            {
                                                socio?.nombre ??
                                                `Socio #${reserva.socioId}`
                                            }

                                            {" — "}

                                            {
                                                clase?.nombre ??
                                                "Clase"
                                            }

                                            {" — "}

                                            {
                                                horario?.fecha ??
                                                "Sin fecha"
                                            }

                                        </option>
                                    );
                                }
                            )}

                        </select>

                    </div>

                    <div className="form-field">

                        <label htmlFor="asistencia-presente">
                            Resultado *
                        </label>

                        <select
                            id="asistencia-presente"
                            value={
                                presente
                            }
                            disabled={
                                guardando
                            }
                            onChange={(e) => {

                                setPresente(
                                    e.target.value
                                );

                                setError("");
                            }}
                        >

                            <option value="true">
                                Presente
                            </option>

                            <option value="false">
                                Ausente
                            </option>

                        </select>

                    </div>

                </div>

                {
                    reservasDisponibles.length ===
                    0 && (

                        <p className="field-error">
                            No existen reservas
                            activas pendientes de
                            asistencia.
                        </p>

                    )
                }

                {error && (

                    <p
                        className="field-error"
                        role="alert"
                    >
                        {error}
                    </p>

                )}

                <div className="form-actions">

                    <Button
                        type="button"
                        variant="secondary"
                        disabled={
                            guardando
                        }
                        onClick={
                            onCancelar
                        }
                    >
                        Cancelar
                    </Button>

                    <Button
                        type="submit"
                        loading={
                            guardando
                        }
                        disabled={
                            reservasDisponibles.length ===
                            0
                        }
                    >
                        Guardar asistencia
                    </Button>

                </div>

            </form>

        </section>
    );
}