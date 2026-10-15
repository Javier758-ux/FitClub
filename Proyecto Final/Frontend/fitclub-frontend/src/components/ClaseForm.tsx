import { useEffect, useState } from "react";
import type { FormEvent } from "react";

import type {
    ClaseApi
} from "../models/ApiModels";

import type {
    ClaseRequest
} from "../services/claseService";

import {
    Button
} from "./ui/Button";

import "./Forms.css";

interface ClaseFormProps {
    claseEditar:
        ClaseApi | null;

    onGuardar:
        (datos: ClaseRequest) => Promise<void>;

    onCancelar:
        () => void;
}

interface ClaseFormData {
    nombre: string;
    descripcion: string;
    cupoMaximo: string;
}

const valoresIniciales:
    ClaseFormData = {
    nombre: "",
    descripcion: "",
    cupoMaximo: ""
};

export default function ClaseForm({
                                      claseEditar,
                                      onGuardar,
                                      onCancelar
                                  }: ClaseFormProps) {

    const [datos, setDatos] =
        useState<ClaseFormData>(
            valoresIniciales
        );

    const [error, setError] =
        useState("");

    const [guardando, setGuardando] =
        useState(false);

    useEffect(() => {

        if (claseEditar) {

            setDatos({
                nombre:
                claseEditar.nombre,

                descripcion:
                    claseEditar.descripcion ?? "",

                cupoMaximo:
                    String(
                        claseEditar.cupoMaximo
                    )
            });

        } else {

            setDatos(
                valoresIniciales
            );
        }

        setError("");

    }, [claseEditar]);

    function cambiarCampo(
        campo:
        keyof ClaseFormData,

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

        const nombre =
            datos.nombre.trim();

        const descripcion =
            datos.descripcion.trim();

        const cupoMaximo =
            Number(
                datos.cupoMaximo
            );

        if (!nombre) {

            setError(
                "El nombre de la clase es obligatorio."
            );

            return;
        }

        if (
            !Number.isInteger(
                cupoMaximo
            ) ||
            cupoMaximo <= 0
        ) {

            setError(
                "El cupo máximo debe ser un entero mayor a 0."
            );

            return;
        }

        setGuardando(true);
        setError("");

        try {

            await onGuardar({
                nombre,
                descripcion,
                cupoMaximo
            });

        } catch (err) {

            setError(
                err instanceof Error
                    ? err.message
                    : "No se pudo guardar la clase."
            );

        } finally {

            setGuardando(false);

        }
    }

    return (
        <section className="entity-form">

            <h2>
                {claseEditar
                    ? `Editar clase #${claseEditar.id}`
                    : "Registrar clase"}
            </h2>

            <form
                onSubmit={guardar}
                noValidate
            >

                <div className="form-grid">

                    <div className="form-field">

                        <label htmlFor="clase-nombre">
                            Nombre *
                        </label>

                        <input
                            id="clase-nombre"
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

                        <label htmlFor="clase-cupo">
                            Cupo máximo *
                        </label>

                        <input
                            id="clase-cupo"
                            type="number"
                            min="1"
                            step="1"
                            value={datos.cupoMaximo}
                            disabled={guardando}
                            onChange={(e) =>
                                cambiarCampo(
                                    "cupoMaximo",
                                    e.target.value
                                )
                            }
                        />

                    </div>

                    <div className="form-field">

                        <label htmlFor="clase-descripcion">
                            Descripción
                        </label>

                        <input
                            id="clase-descripcion"
                            type="text"
                            value={datos.descripcion}
                            disabled={guardando}
                            onChange={(e) =>
                                cambiarCampo(
                                    "descripcion",
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
                        {claseEditar
                            ? "Actualizar clase"
                            : "Guardar clase"}
                    </Button>

                </div>

            </form>

        </section>
    );
}