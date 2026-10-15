import { useState } from "react";
import type { FormEvent } from "react";
import type {
    MembresiaRequest,
    SocioApi
} from "../models/ApiModels";
import type { Plan } from "../models/Plan";
import "./Forms.css";

interface Props {
    socios: SocioApi[];
    planes: Plan[];
    onGuardar: (datos: MembresiaRequest) => Promise<void>;
}

export default function MembresiaForm({
                                          socios,
                                          planes,
                                          onGuardar
                                      }: Props) {
    const [socioId, setSocioId] = useState("");
    const [planId, setPlanId] = useState("");
    const [fechaInicio, setFechaInicio] = useState("");
    const [error, setError] = useState("");
    const [guardando, setGuardando] = useState(false);

    async function guardar(evento: FormEvent<HTMLFormElement>) {
        evento.preventDefault();

        if (!socioId || !planId || !fechaInicio) {
            setError("Todos los campos son obligatorios.");
            return;
        }

        setError("");
        setGuardando(true);

        try {
            await onGuardar({
                socioId: Number(socioId),
                planId: Number(planId),
                fechaInicio
            });

            setSocioId("");
            setPlanId("");
            setFechaInicio("");
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "No se pudo registrar la membresía."
            );
        } finally {
            setGuardando(false);
        }
    }

    return (
        <section className="entity-form">
            <h2>Registrar membresía</h2>

            <form onSubmit={guardar}>
                <div className="form-grid">
                    <div className="form-field">
                        <label htmlFor="socio">Socio *</label>
                        <select
                            id="socio"
                            value={socioId}
                            onChange={(e) => setSocioId(e.target.value)}
                            required
                        >
                            <option value="">Seleccionar socio</option>

                            {socios.map((socio) => (
                                <option key={socio.id} value={socio.id}>
                                    {socio.nombre}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-field">
                        <label htmlFor="plan">Plan *</label>
                        <select
                            id="plan"
                            value={planId}
                            onChange={(e) => setPlanId(e.target.value)}
                            required
                        >
                            <option value="">Seleccionar plan</option>

                            {planes.map((plan) => (
                                <option key={plan.id} value={plan.id}>
                                    {plan.nombre} — Bs {plan.precio}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-field">
                        <label htmlFor="fecha-inicio">Fecha de inicio *</label>
                        <input
                            id="fecha-inicio"
                            type="date"
                            value={fechaInicio}
                            onChange={(e) => setFechaInicio(e.target.value)}
                            required
                        />
                    </div>
                </div>

                {error && (
                    <p className="field-error" role="alert">{error}</p>
                )}

                <div className="form-actions">
                    <button
                        type="submit"
                        className="btn-primary"
                        disabled={guardando}
                    >
                        {guardando ? "Guardando..." : "Guardar membresía"}
                    </button>
                </div>
            </form>
        </section>
    );
}
