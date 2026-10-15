import {
    apiClient
} from "./apiClient";

import {
    eliminarToken,
    guardarToken,
    obtenerToken
} from "../auth/authStorage";

export type RolUsuario =
    | "ADMINISTRADOR"
    | "RECEPCION"
    | "INSTRUCTOR"
    | "SOCIO";

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    token: string;
    tipo: string;
    usuarioId: number;
    nombre: string;
    email: string;
    rol: RolUsuario;
}

export interface UsuarioActual {
    id: number;
    nombre: string;
    email: string;
    rol: RolUsuario;
    socioId: number | null;
    instructorId: number | null;
}

export const authService = {

    async iniciarSesion(
        datos: LoginRequest
    ): Promise<LoginResponse> {

        const respuesta =
            await apiClient
                .post<LoginResponse>(
                    "/auth/login",
                    datos
                );

        if (!respuesta.token) {

            throw new Error(
                "El backend no devolvió un token de autenticación"
            );
        }

        guardarToken(
            respuesta.token
        );

        return respuesta;
    },

    obtenerUsuarioActual(
        signal?: AbortSignal
    ): Promise<UsuarioActual> {

        return apiClient
            .get<UsuarioActual>(
                "/auth/me",
                signal
            );
    },

    obtenerToken():
        string | null {

        return obtenerToken();
    },

    haySesion():
        boolean {

        return Boolean(
            obtenerToken()
        );
    },

    cerrarSesion():
        void {

        eliminarToken();
    }

};