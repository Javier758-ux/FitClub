import {
    Navigate,
    Outlet
} from "react-router-dom";

import type {
    RolUsuario
} from "../services/authService";

import {
    useAuth
} from "./AuthContext";

interface ProtectedRouteProps {
    roles?:
        readonly RolUsuario[];
}

export default function ProtectedRoute({
                                           roles
                                       }: ProtectedRouteProps) {

    const {
        usuario,
        cargandoSesion
    } = useAuth();

    if (cargandoSesion) {

        return (
            <main
                style={{
                    padding: 32
                }}
            >
                Verificando sesión...
            </main>
        );
    }

    if (!usuario) {

        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }

    if (
        roles &&
        !roles.includes(
            usuario.rol
        )
    ) {

        return (
            <Navigate
                to="/sin-permiso"
                replace
            />
        );
    }

    return <Outlet />;
}