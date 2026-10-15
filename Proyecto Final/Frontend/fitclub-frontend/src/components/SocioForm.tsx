import { useState } from "react";
import type { FormEvent } from "react";

import type {
    SocioApi,
    SocioRequest
} from "../models/ApiModels";

interface SocioFormProps {
    socioEditar: SocioApi | null;
    onGuardar: (datos: SocioRequest) => Promise<void>;
    onCancelar: () => void;
}

export default function SocioForm({
                                      socioEditar,
                                      onGuardar,
                                      onCancelar
                                  }: SocioFormProps) {

    const [datos, setDatos] = useState<SocioRequest>(() => ({
        nombre: socioEditar?.nombre ?? "",
        email: socioEditar?.email ?? "",
        telefono: socioEditar?.telefono ?? ""
    }));

    const [guardando, setGuardando] = useState(false);
    const [error, setError] = useState("");

    const editando = socioEditar !== null;

    function actualizarCampo(
        campo: keyof SocioRequest,
        valor: string
    ) {
        setDatos((anterior) => ({
            ...anterior,
            [campo]: valor
        }));

        setError("");
    }

    async function manejarEnvio(
        evento: FormEvent<HTMLFormElement>
    ) {
        evento.preventDefault();

        const nombre = datos.nombre.trim();
        const email = datos.email.trim().toLowerCase();
        const telefono = datos.telefono.trim();

        if (!nombre) {
            setError("El nombre es obligatorio.");
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError("Ingresa un correo válido.");
            return;
        }

        if (!/^\d{7,10}$/.test(telefono)) {
            setError("El teléfono debe tener de 7 a 10 dígitos.");
            return;
        }

        setGuardando(true);
        setError("");

        try {
            await onGuardar({
                nombre,
                email,
                telefono
            });
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "No fue posible guardar el socio."
            );
        } finally {
            setGuardando(false);
        }
    }

    return (
        <section className="socios-crud__form-card">
            <h2>
                {editando
                    ? `Editar socio #${socioEditar.id}`
                    : "Registrar nuevo socio"}
            </h2>

            <form onSubmit={manejarEnvio} noValidate>
                <div className="socios-crud__form-grid">

                    <div className="socios-crud__field">
                        <label htmlFor="socio-nombre">
                            Nombre completo *
                        </label>
                        <input
                            id="socio-nombre"
                            type="text"
                            value={datos.nombre}
                            onChange={(e) =>
                                actualizarCampo("nombre", e.target.value)
                            }
                            disabled={guardando}
                        />
                    </div>

                    <div className="socios-crud__field">
                        <label htmlFor="socio-email">
                            Correo electrónico *
                        </label>
                        <input
                            id="socio-email"
                            type="email"
                            value={datos.email}
                            onChange={(e) =>
                                actualizarCampo("email", e.target.value)
                            }
                            disabled={guardando}
                        />
                    </div>

                    <div className="socios-crud__field">
                        <label htmlFor="socio-telefono">
                            Teléfono *
                        </label>
                        <input
                            id="socio-telefono"
                            type="tel"
                            value={datos.telefono}
                            onChange={(e) =>
                                actualizarCampo("telefono", e.target.value)
                            }
                            disabled={guardando}
                        />
                    </div>
                </div>

                {error && (
                    <p className="socios-crud__error" role="alert">
                        {error}
                    </p>
                )}

                <div className="socios-crud__form-actions">
                    <button
                        type="button"
                        className="socios-crud__btn-secondary"
                        onClick={onCancelar}
                        disabled={guardando}
                    >
                        Cancelar
                    </button>

                    <button
                        type="submit"
                        className="socios-crud__btn-primary"
                        disabled={guardando}
                    >
                        {guardando
                            ? "Guardando..."
                            : editando
                                ? "Actualizar socio"
                                : "Registrar socio"}
                    </button>
                </div>
            </form>
        </section>
    );
}
