import { useEffect, useState } from "react";
import type { FormEvent } from "react";

import type {
    ClaseApi,
    InstructorApi,
    HorarioApi,
    HorarioRequest
} from "../models/ApiModels";

import "./Forms.css";

interface HorarioFormProps {
    clases: ClaseApi[];
    instructores: InstructorApi[];
    horarioEditar: HorarioApi | null;
    onGuardar: (
        datos: HorarioRequest
    ) => Promise<void>;
    onCancelar: () => void;
}

interface HorarioFormData {
    claseId: string;
    instructorId: string;
    fecha: string;
    horaInicio: string;
    horaFin: string;
}

const valoresIniciales: HorarioFormData = {
    claseId: "",
    instructorId: "",
    fecha: "",
    horaInicio: "",
    horaFin: ""
};

function normalizarHora(
    hora: string
): string {
    return hora.length >= 5
        ? hora.slice(0, 5)
        : hora;
}

export default function HorarioForm({
                                        clases,
                                        instructores,
                                        horarioEditar,
                                        onGuardar,
                                        onCancelar
                                    }: HorarioFormProps) {
    const [datos, setDatos] =
        useState<HorarioFormData>(
            valoresIniciales
        );

    const [error, setError] =
        useState("");

    const [guardando, setGuardando] =
        useState(false);

    useEffect(() => {
        if (horarioEditar) {
            setDatos({
                claseId:
                    String(horarioEditar.claseId),

                instructorId:
                    String(
                        horarioEditar.instructorId
                    ),

                fecha:
                horarioEditar.fecha,

                horaInicio:
                    normalizarHora(
                        horarioEditar.horaInicio
                    ),

                horaFin:
                    normalizarHora(
                        horarioEditar.horaFin
                    )
            });
        } else {
            setDatos(valoresIniciales);
        }

        setError("");
    }, [horarioEditar]);

    function cambiarCampo(
        campo: keyof HorarioFormData,
        valor: string
    ) {
        setDatos((anteriores) => ({
            ...anteriores,
            [campo]: valor
        }));

        setError("");
    }

    async function guardar(
        evento: FormEvent<HTMLFormElement>
    ) {
        evento.preventDefault();

        const claseId =
            Number(datos.claseId);

        const instructorId =
            Number(datos.instructorId);

        const claseExiste =
            clases.some(
                (clase) =>
                    clase.id === claseId
            );

        const instructorExiste =
            instructores.some(
                (instructor) =>
                    instructor.id ===
                    instructorId
            );

        if (!claseExiste) {
            setError(
                "Selecciona una clase válida."
            );
            return;
        }

        if (!instructorExiste) {
            setError(
                "Selecciona un instructor válido."
            );
            return;
        }

        if (!datos.fecha) {
            setError(
                "La fecha es obligatoria."
            );
            return;
        }

        if (
            !datos.horaInicio ||
            !datos.horaFin
        ) {
            setError(
                "La hora de inicio y fin son obligatorias."
            );
            return;
        }

        if (
            datos.horaInicio >=
            datos.horaFin
        ) {
            setError(
                "La hora de fin debe ser posterior a la hora de inicio."
            );
            return;
        }

        setGuardando(true);
        setError("");

        try {
            await onGuardar({
                claseId,
                instructorId,
                fecha: datos.fecha,
                horaInicio: datos.horaInicio,
                horaFin: datos.horaFin
            });
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "No se pudo guardar el horario."
            );
        } finally {
            setGuardando(false);
        }
    }

    return (
        <section className="entity-form">
            <h2>
                {horarioEditar
                    ? `Editar horario #${horarioEditar.id}`
                    : "Registrar horario"}
            </h2>

            <form
                onSubmit={guardar}
                noValidate
            >
                <div className="form-grid">

                    <div className="form-field">
                        <label htmlFor="horario-clase">
                            Clase *
                        </label>

                        <select
                            id="horario-clase"
                            value={datos.claseId}
                            disabled={guardando}
                            onChange={(e) =>
                                cambiarCampo(
                                    "claseId",
                                    e.target.value
                                )
                            }
                        >
                            <option value="">
                                Seleccionar clase
                            </option>

                            {clases.map(
                                (clase) => (
                                    <option
                                        key={clase.id}
                                        value={
                                            String(clase.id)
                                        }
                                    >
                                        {clase.nombre}
                                        {" — "}
                                        cupo {clase.cupoMaximo}
                                    </option>
                                )
                            )}
                        </select>
                    </div>

                    <div className="form-field">
                        <label htmlFor="horario-instructor">
                            Instructor *
                        </label>

                        <select
                            id="horario-instructor"
                            value={
                                datos.instructorId
                            }
                            disabled={guardando}
                            onChange={(e) =>
                                cambiarCampo(
                                    "instructorId",
                                    e.target.value
                                )
                            }
                        >
                            <option value="">
                                Seleccionar instructor
                            </option>

                            {instructores.map(
                                (instructor) => (
                                    <option
                                        key={instructor.id}
                                        value={
                                            String(
                                                instructor.id
                                            )
                                        }
                                    >
                                        {instructor.nombre}
                                        {" — "}
                                        {
                                            instructor.especialidad
                                        }
                                    </option>
                                )
                            )}
                        </select>
                    </div>

                    <div className="form-field">
                        <label htmlFor="horario-fecha">
                            Fecha *
                        </label>

                        <input
                            id="horario-fecha"
                            type="date"
                            value={datos.fecha}
                            disabled={guardando}
                            onChange={(e) =>
                                cambiarCampo(
                                    "fecha",
                                    e.target.value
                                )
                            }
                        />
                    </div>

                    <div className="form-field">
                        <label htmlFor="horario-inicio">
                            Hora de inicio *
                        </label>

                        <input
                            id="horario-inicio"
                            type="time"
                            value={datos.horaInicio}
                            disabled={guardando}
                            onChange={(e) =>
                                cambiarCampo(
                                    "horaInicio",
                                    e.target.value
                                )
                            }
                        />
                    </div>

                    <div className="form-field">
                        <label htmlFor="horario-fin">
                            Hora de fin *
                        </label>

                        <input
                            id="horario-fin"
                            type="time"
                            value={datos.horaFin}
                            disabled={guardando}
                            onChange={(e) =>
                                cambiarCampo(
                                    "horaFin",
                                    e.target.value
                                )
                            }
                        />
                    </div>

                </div>

                {error && (
                    <p
                        className="field-error"
                        role="alert"
                    >
                        {error}
                    </p>
                )}

                <div className="form-actions">
                    <button
                        type="button"
                        className="btn-secondary"
                        disabled={guardando}
                        onClick={onCancelar}
                    >
                        Cancelar
                    </button>

                    <button
                        type="submit"
                        className="btn-primary"
                        disabled={guardando}
                    >
                        {guardando
                            ? "Guardando..."
                            : horarioEditar
                                ? "Actualizar horario"
                                : "Guardar horario"}
                    </button>
                </div>
            </form>
        </section>
    );
}