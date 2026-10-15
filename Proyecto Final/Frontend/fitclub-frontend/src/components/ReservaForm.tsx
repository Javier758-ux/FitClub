import {
    useMemo,
    useState
} from "react";

import type {
    FormEvent
} from "react";

import type {
    ClaseApi,
    HorarioApi,
    SocioApi
} from "../models/ApiModels";

import {
    Button
} from "./ui/Button";

import "./Forms.css";

interface ReservaFormProps {
    modo:
        | "PROPIA"
        | "ADMINISTRATIVA";

    socios: SocioApi[];
    horarios: HorarioApi[];
    clases: ClaseApi[];

    onGuardar: (
        horarioClaseId: number,
        socioId?: number
    ) => Promise<void>;

    onCancelar: () => void;
}

function horarioEsFuturo(
    horario: HorarioApi
): boolean {

    const inicio =
        new Date(
            `${horario.fecha}T${horario.horaInicio}`
        );

    return (
        !Number.isNaN(
            inicio.getTime()
        ) &&
        inicio.getTime() >
        Date.now()
    );
}

export default function ReservaForm({
                                        modo,
                                        socios,
                                        horarios,
                                        clases,
                                        onGuardar,
                                        onCancelar
                                    }: ReservaFormProps) {

    const [
        socioId,
        setSocioId
    ] = useState("");

    const [
        horarioClaseId,
        setHorarioClaseId
    ] = useState("");

    const [
        guardando,
        setGuardando
    ] = useState(false);

    const [
        error,
        setError
    ] = useState("");

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

    const horariosDisponibles =
        useMemo(
            () =>
                horarios
                    .filter(
                        horarioEsFuturo
                    )
                    .sort(
                        (a, b) => {

                            const fechaA =
                                `${a.fecha}T${a.horaInicio}`;

                            const fechaB =
                                `${b.fecha}T${b.horaInicio}`;

                            return fechaA.localeCompare(
                                fechaB
                            );
                        }
                    ),
            [horarios]
        );

    async function guardar(
        evento:
        FormEvent<HTMLFormElement>
    ) {

        evento.preventDefault();

        const horarioId =
            Number(
                horarioClaseId
            );

        if (
            !horarioClaseId ||
            !horariosDisponibles.some(
                (horario) =>
                    horario.id ===
                    horarioId
            )
        ) {

            setError(
                "Selecciona un horario futuro válido."
            );

            return;
        }

        let socioNumero:
            number | undefined;

        if (
            modo ===
            "ADMINISTRATIVA"
        ) {

            socioNumero =
                Number(socioId);

            if (
                !socioId ||
                !socios.some(
                    (socio) =>
                        socio.id ===
                        socioNumero
                )
            ) {

                setError(
                    "Selecciona un socio válido."
                );

                return;
            }
        }

        setGuardando(true);
        setError("");

        try {

            await onGuardar(
                horarioId,
                socioNumero
            );

        } catch (err) {

            setError(
                err instanceof Error
                    ? err.message
                    : "No se pudo registrar la reserva."
            );

        } finally {

            setGuardando(false);

        }
    }

    return (
        <section className="entity-form">

            <h2>
                {modo === "PROPIA"
                    ? "Reservar una clase"
                    : "Registrar reserva"}
            </h2>

            <form
                onSubmit={guardar}
                noValidate
            >

                <div className="form-grid">

                    {modo ===
                        "ADMINISTRATIVA" && (

                            <div className="form-field">

                                <label htmlFor="reserva-socio">
                                    Socio *
                                </label>

                                <select
                                    id="reserva-socio"
                                    value={socioId}
                                    disabled={
                                        guardando
                                    }
                                    onChange={(e) => {

                                        setSocioId(
                                            e.target.value
                                        );

                                        setError("");
                                    }}
                                >

                                    <option value="">
                                        Seleccionar socio
                                    </option>

                                    {socios.map(
                                        (socio) => (

                                            <option
                                                key={
                                                    socio.id
                                                }
                                                value={
                                                    String(
                                                        socio.id
                                                    )
                                                }
                                            >
                                                {socio.nombre}
                                                {" — "}
                                                {socio.email}
                                            </option>

                                        )
                                    )}

                                </select>

                            </div>

                        )}

                    <div className="form-field">

                        <label htmlFor="reserva-horario">
                            Clase y horario *
                        </label>

                        <select
                            id="reserva-horario"
                            value={
                                horarioClaseId
                            }
                            disabled={
                                guardando
                            }
                            onChange={(e) => {

                                setHorarioClaseId(
                                    e.target.value
                                );

                                setError("");
                            }}
                        >

                            <option value="">
                                Seleccionar horario
                            </option>

                            {horariosDisponibles.map(
                                (horario) => {

                                    const clase =
                                        clasesPorId.get(
                                            horario.claseId
                                        );

                                    return (
                                        <option
                                            key={
                                                horario.id
                                            }
                                            value={
                                                String(
                                                    horario.id
                                                )
                                            }
                                        >
                                            {
                                                clase?.nombre ??
                                                `Clase #${horario.claseId}`
                                            }

                                            {" — "}

                                            {
                                                horario.fecha
                                            }

                                            {" — "}

                                            {
                                                horario.horaInicio.slice(
                                                    0,
                                                    5
                                                )
                                            }

                                            {" a "}

                                            {
                                                horario.horaFin.slice(
                                                    0,
                                                    5
                                                )
                                            }

                                        </option>
                                    );
                                }
                            )}

                        </select>

                    </div>

                </div>

                {horariosDisponibles
                    .length === 0 && (

                    <p className="field-error">
                        No existen horarios
                        futuros disponibles
                        para seleccionar.
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
                            horariosDisponibles
                                .length === 0
                        }
                    >
                        Guardar reserva
                    </Button>

                </div>

            </form>

        </section>
    );
}