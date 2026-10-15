import { useEffect, useState } from "react";
import type { FormEvent } from "react";

import type { Plan } from "../models/Plan";
import type { PlanRequest } from "../services/planService";

import { Button } from "./ui/Button";
import "./Forms.css";

interface PlanFormProps {
    planEditar: Plan | null;
    onGuardar: (datos: PlanRequest) => Promise<void>;
    onCancelar: () => void;
}

interface PlanFormData {
    nombre: string;
    descripcion: string;
    precio: string;
    duracionDias: string;
}

const valoresIniciales: PlanFormData = {
    nombre: "",
    descripcion: "",
    precio: "",
    duracionDias: ""
};

export default function PlanForm({
                                     planEditar,
                                     onGuardar,
                                     onCancelar
                                 }: PlanFormProps) {

    const [datos, setDatos] =
        useState<PlanFormData>(valoresIniciales);

    const [error, setError] =
        useState("");

    const [guardando, setGuardando] =
        useState(false);

    useEffect(() => {
        if (planEditar) {
            setDatos({
                nombre:
                planEditar.nombre,

                descripcion:
                    planEditar.descripcion ?? "",

                precio:
                    String(planEditar.precio),

                duracionDias:
                    String(planEditar.duracionDias)
            });
        } else {
            setDatos(valoresIniciales);
        }

        setError("");
    }, [planEditar]);

    function cambiarCampo(
        campo: keyof PlanFormData,
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

        const nombre =
            datos.nombre.trim();

        const descripcion =
            datos.descripcion.trim();

        const precio =
            Number(datos.precio);

        const duracionDias =
            Number(datos.duracionDias);

        if (!nombre) {
            setError(
                "El nombre del plan es obligatorio."
            );
            return;
        }

        if (
            !Number.isFinite(precio) ||
            precio <= 0
        ) {
            setError(
                "El precio debe ser mayor a 0."
            );
            return;
        }

        if (
            !Number.isInteger(duracionDias) ||
            duracionDias <= 0
        ) {
            setError(
                "La duración debe ser un número entero mayor a 0."
            );
            return;
        }

        setGuardando(true);
        setError("");

        try {
            await onGuardar({
                nombre,
                descripcion,
                precio,
                duracionDias
            });
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "No se pudo guardar el plan."
            );
        } finally {
            setGuardando(false);
        }
    }

    return (
        <section className="entity-form">

            <h2>
                {planEditar
                    ? `Editar plan #${planEditar.id}`
                    : "Registrar plan"}
            </h2>

            <form
                onSubmit={guardar}
                noValidate
            >

                <div className="form-grid">

                    <div className="form-field">
                        <label htmlFor="plan-nombre">
                            Nombre *
                        </label>

                        <input
                            id="plan-nombre"
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

                        <label htmlFor="plan-precio">
                            Precio (Bs) *
                        </label>

                        <input
                            id="plan-precio"
                            type="number"
                            min="0.01"
                            step="0.01"
                            value={datos.precio}
                            disabled={guardando}
                            onChange={(e) =>
                                cambiarCampo(
                                    "precio",
                                    e.target.value
                                )
                            }
                        />

                    </div>

                    <div className="form-field">

                        <label htmlFor="plan-duracion">
                            Duración en días *
                        </label>

                        <input
                            id="plan-duracion"
                            type="number"
                            min="1"
                            step="1"
                            value={datos.duracionDias}
                            disabled={guardando}
                            onChange={(e) =>
                                cambiarCampo(
                                    "duracionDias",
                                    e.target.value
                                )
                            }
                        />

                    </div>

                    <div className="form-field">

                        <label htmlFor="plan-descripcion">
                            Descripción
                        </label>

                        <input
                            id="plan-descripcion"
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
                        {planEditar
                            ? "Actualizar plan"
                            : "Guardar plan"}
                    </Button>

                </div>

            </form>

        </section>
    );
}