import {
    Link
} from "react-router-dom";

export default function ForbiddenPage() {

    return (
        <section>

            <h1>
                Acceso no permitido
            </h1>

            <p>
                Tu rol no tiene permiso
                para acceder a este módulo.
            </p>

            <Link to="/">
                Volver al Dashboard
            </Link>

        </section>
    );
}