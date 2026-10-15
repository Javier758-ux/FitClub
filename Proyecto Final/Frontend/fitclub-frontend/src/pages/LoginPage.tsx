import {
    useState
} from "react";

import type {
    FormEvent
} from "react";

import {
    useAuth
} from "../auth/AuthContext";

import "../components/Forms.css";

export default function LoginPage() {

    const [
        email,
        setEmail
    ] = useState("");

    const [
        password,
        setPassword
    ] = useState("");

    const [
        cargando,
        setCargando
    ] = useState(false);

    const [
        error,
        setError
    ] = useState("");

    const {
        iniciarSesion
    } = useAuth();

    async function manejarInicioSesion(
        evento:
        FormEvent<HTMLFormElement>
    ) {

        evento.preventDefault();

        setCargando(true);
        setError("");

        try {

            await iniciarSesion({
                email:
                    email.trim(),

                password
            });

        } catch (err) {

            setError(
                err instanceof Error
                    ? err.message
                    : "No se pudo iniciar sesión."
            );

        } finally {

            setCargando(false);
        }
    }

    return (
        <main
            style={{
                maxWidth: 450,
                margin: "80px auto",
                padding: 20
            }}
        >

            <section className="entity-form">

                <h1>
                    FitClub
                </h1>

                <h2>
                    Iniciar sesión
                </h2>

                <form
                    onSubmit={
                        manejarInicioSesion
                    }
                >

                    <div className="form-field">

                        <label htmlFor="email">
                            Correo electrónico
                        </label>

                        <input
                            id="email"
                            type="email"
                            required
                            autoComplete="email"
                            value={email}
                            disabled={cargando}
                            onChange={(e) =>
                                setEmail(
                                    e.target.value
                                )
                            }
                        />

                    </div>

                    <div
                        className="form-field"
                        style={{
                            marginTop: 15
                        }}
                    >

                        <label htmlFor="password">
                            Contraseña
                        </label>

                        <input
                            id="password"
                            type="password"
                            required
                            autoComplete="current-password"
                            value={password}
                            disabled={cargando}
                            onChange={(e) =>
                                setPassword(
                                    e.target.value
                                )
                            }
                        />

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
                            type="submit"
                            className="btn-primary"
                            disabled={cargando}
                        >
                            {cargando
                                ? "Ingresando..."
                                : "Ingresar"}
                        </button>

                    </div>

                </form>

            </section>

        </main>
    );
}