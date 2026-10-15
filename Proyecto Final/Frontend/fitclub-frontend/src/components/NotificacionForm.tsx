import {
    useState
} from "react";

import type {
    FormEvent
} from "react";

import type {
    NotificacionRequest,
    SocioApi
} from "../models/ApiModels";

import {
    Button
} from "./ui/Button";

import "./Forms.css";

interface NotificacionFormProps {
    socios: SocioApi[];

    onGuardar:
        (datos: NotificacionRequest) => Promise<void>;

    onCancelar:
        () => void;
}

export default function NotificacionForm({
                                             socios,
                                             onGuardar,
                                             onCancelar
                                         }: NotificacionFormProps) {

    const [
        socioId,
        setSocioId
    ] = useState("");

    const [
        titulo,
        setTitulo
    ] = useState("");

    const [
        mensaje,
        setMensaje
    ] = useState("");

    const [
        guardando,
        setGuardando
    ] = useState(false);

    const [
        error,
        setError
    ] = useState("");

    async function guardar(
        evento:
        FormEvent<HTMLFormElement>
    ) {

        evento.preventDefault();

        const socioNumero =
            Number(socioId);

        const tituloLimpio =
            titulo.trim();

        const mensajeLimpio =
            mensaje.trim();

        if (
            !socioId ||
            !socios.some(
                (socio) =>
                    socio.id === socioNumero
            )
        ) {

            setError(
                "Selecciona un socio válido."
            );

            return;
        }

        if (!tituloLimpio) {

            setError(
                "El título es obligatorio."
            );

            return;
        }

        if (!mensajeLimpio) {

            setError(
                "El mensaje es obligatorio."
            );

            return;
        }

        setGuardando(true);
        setError("");

        try {

            await onGuardar({
                socioId:
                socioNumero,

                titulo:
                tituloLimpio,

                mensaje:
                mensajeLimpio
            });

            setSocioId("");
            setTitulo("");
            setMensaje("");

        } catch (err) {

            setError(
                err instanceof Error
                    ? err.message
                    : "No se pudo crear la notificación."
            );

        } finally {

            setGuardando(false);

        }
    }

    return (
        <section className="entity-form">

            <h2>
                Nueva notificación
            </h2>

            <form
                onSubmit={guardar}
                noValidate
            >

                <div className="form-grid">

                    <div className="form-field">

                        <label htmlFor="notificacion-socio">
                            Socio *
                        </label>

                        <select
                            id="notificacion-socio"
                            value={
                                socioId
                            }
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

                    <div className="form-field">

                        <label htmlFor="notificacion-titulo">
                            Título *
                        </label>

                        <input
                            id="notificacion-titulo"
                            type="text"
                            value={
                                titulo
                            }
                            disabled={
                                guardando
                            }
                            onChange={(e) => {

                                setTitulo(
                                    e.target.value
                                );

                                setError("");
                            }}
                        />

                    </div>

                    <div className="form-field notificaciones-form-wide">

                        <label htmlFor="notificacion-mensaje">
                            Mensaje *
                        </label>

                        <textarea
                            id="notificacion-mensaje"
                            rows={5}
                            value={
                                mensaje
                            }
                            disabled={
                                guardando
                            }
                            onChange={(e) => {

                                setMensaje(
                                    e.target.value
                                );

                                setError("");
                            }}
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
                    >
                        Enviar notificación
                    </Button>

                </div>

            </form>

        </section>
    );
}