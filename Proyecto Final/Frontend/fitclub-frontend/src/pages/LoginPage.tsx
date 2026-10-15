import { useState } from "react";
import type { FormEvent } from "react";
import { authService } from "../services/authService";
import "../components/Forms.css";

interface Props {
    onLogin: () => void;
}

export default function LoginPage({ onLogin }: Props) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState("");

    async function iniciarSesion(
        evento: FormEvent<HTMLFormElement>
    ) {
        evento.preventDefault();
        setCargando(true);
        setError("");

        try {
            await authService.iniciarSesion({
                email: email.trim(),
                password
            });

            onLogin();
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
        <main style={{
            maxWidth: 450,
            margin: "80px auto",
            padding: 20
        }}>
            <section className="entity-form">
                <h1>FitClub</h1>
                <h2>Iniciar sesión</h2>

                <form onSubmit={iniciarSesion}>
                    <div className="form-field">
                        <label htmlFor="email">Correo electrónico</label>
                        <input
                            id="email"
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="form-field" style={{ marginTop: 15 }}>
                        <label htmlFor="password">Contraseña</label>
                        <input
                            id="password"
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    {error && (
                        <p className="field-error" role="alert">
                            {error}
                        </p>
                    )}

                    <div className="form-actions">
                        <button
                            type="submit"
                            className="btn-primary"
                            disabled={cargando}
                        >
                            {cargando ? "Ingresando..." : "Ingresar"}
                        </button>
                    </div>
                </form>
            </section>
        </main>
    );
}
