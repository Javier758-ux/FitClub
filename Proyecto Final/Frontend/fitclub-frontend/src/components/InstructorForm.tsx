import { useEffect, useState } from "react";
import type { FormEvent } from "react";

import type {
    InstructorApi
} from "../models/ApiModels";

import type {
    InstructorRequest
} from "../services/instructorService";

import {
    Button
} from "./ui/Button";

import "./Forms.css";

interface InstructorFormProps {
    instructorEditar:
        InstructorApi | null;

    onGuardar:
        (datos: InstructorRequest) => Promise<void>;

    onCancelar:
        () => void;
}

const valoresIniciales:
    InstructorRequest = {
    nombre: "",
    email: "",
    telefono: "",
    especialidad: ""
};

export default function InstructorForm({
                                           instructorEditar,
                                           onGuardar,
                                           onCancelar
                                       }: InstructorFormProps) {

    const [datos, setDatos] =
        useState<InstructorRequest>(
            valoresIniciales
        );

    const [error, setError] =
        useState("");

    const [guardando, setGuardando] =
        useState(false);

    useEffect(() => {

        if (instructorEditar) {

            setDatos({
                nombre:
                instructorEditar.nombre,

                email:
                instructorEditar.email,

                telefono:
                instructorEditar.telefono,

                especialidad:
                instructorEditar.especialidad
            });

        } else {

            setDatos(
                valoresIniciales
            );
        }

        setError("");

    }, [instructorEditar]);

    function cambiarCampo(
        campo:
        keyof InstructorRequest,

        valor: string
    ) {

        setDatos(
            (anteriores) => ({
                ...anteriores,
                [campo]: valor
            })
        );

        setError("");
    }

    async function guardar(
        evento:
        FormEvent<HTMLFormElement>
    ) {

        evento.preventDefault();

        const payload:
            InstructorRequest = {

            nombre:
                datos.nombre.trim(),

            email:
                datos.email
                    .trim()
                    .toLowerCase(),

            telefono:
                datos.telefono.trim(),

            especialidad:
                datos.especialidad.trim()
        };

        if (!payload.nombre) {

            setError(
                "El nombre es obligatorio."
            );

            return;
        }

        if (
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/
                .test(payload.email)
        ) {

            setError(
                "Ingresa un correo electrónico válido."
            );

            return;
        }

        if (!payload.telefono) {

            setError(
                "El teléfono es obligatorio."
            );

            return;
        }

        if (!payload.especialidad) {

            setError(
                "La especialidad es obligatoria."
            );

            return;
        }

        setGuardando(true);
        setError("");

        try {

            await onGuardar(
                payload
            );

        } catch (err) {

            setError(
                err instanceof Error
                    ? err.message
                    : "No se pudo guardar el instructor."
            );

        } finally {

            setGuardando(false);

        }
    }

    return (
        <section className="entity-form">

            <h2>
                {instructorEditar
                    ? `Editar instructor #${instructorEditar.id}`
                    : "Registrar instructor"}
            </h2>

            <form
                onSubmit={guardar}
                noValidate
            >

                <div className="form-grid">

                    <div className="form-field">

                        <label htmlFor="instructor-nombre">
                            Nombre *
                        </label>

                        <input
                            id="instructor-nombre"
                            type="text"
                            value={datos.nombre}
                            disabled={guardando}
                            onChange={(e) =>
                                cambiarCampo(
                                    "nombre",
                                    e.target.value
                                )
                            }
                        />

                    </div>

                    <div className="form-field">

                        <label htmlFor="instructor-email">
                            Correo *
                        </label>

                        <input
                            id="instructor-email"
                            type="email"
                            value={datos.email}
                            disabled={guardando}
                            onChange={(e) =>
                                cambiarCampo(
                                    "email",
                                    e.target.value
                                )
                            }
                        />

                    </div>

                    <div className="form-field">

                        <label htmlFor="instructor-telefono">
                            Teléfono *
                        </label>

                        <input
                            id="instructor-telefono"
                            type="tel"
                            value={datos.telefono}
                            disabled={guardando}
                            onChange={(e) =>
                                cambiarCampo(
                                    "telefono",
                                    e.target.value
                                )
                            }
                        />

                    </div>

                    <div className="form-field">

                        <label htmlFor="instructor-especialidad">
                            Especialidad *
                        </label>

                        <input
                            id="instructor-especialidad"
                            type="text"
                            value={datos.especialidad}
                            disabled={guardando}
                            onChange={(e) =>
                                cambiarCampo(
                                    "especialidad",
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

                    <Button
                        type="button"
                        variant="secondary"
                        disabled={guardando}
                        onClick={onCancelar}
                    >
                        Cancelar
                    </Button>

                    <Button
                        type="submit"
                        loading={guardando}
                    >
                        {instructorEditar
                            ? "Actualizar instructor"
                            : "Guardar instructor"}
                    </Button>

                </div>

            </form>

        </section>
    );
}