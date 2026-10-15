import { apiClient } from "./apiClient";

// Roles definidos en el backend de FitClub
export type RolUsuario =
    | "ADMINISTRADOR"
    | "RECEPCION"
    | "INSTRUCTOR"
    | "SOCIO";

// Datos enviados para iniciar sesión
export interface LoginRequest {
    email: string;
    password: string;
}

// Respuesta del backend al iniciar sesión
export interface LoginResponse {
    token: string;
    tipo: string;
    usuarioId: number;
    nombre: string;
    email: string;
    rol: RolUsuario;
}

// Información del usuario autenticado
export interface UsuarioActual {
    id: number;
    nombre: string;
    email: string;
    rol: RolUsuario;
    socioId: number | null;
    instructorId: number | null;
}

const TOKEN_KEY = "fitclub_token";

export const authService = {

    // Iniciar sesión
    async iniciarSesion(
        datos: LoginRequest
    ): Promise<LoginResponse> {

        const respuesta = await apiClient.post<LoginResponse>(
            "/auth/login",
            datos
        );

        if (!respuesta.token) {
            throw new Error(
                "El backend no devolvió un token de autenticación"
            );
        }

        sessionStorage.setItem(TOKEN_KEY, respuesta.token);

        return respuesta;
    },

    // Consultar usuario autenticado
    async obtenerUsuarioActual(): Promise<UsuarioActual> {
        return apiClient.get<UsuarioActual>("/auth/me");
    },

    // Obtener token almacenado
    obtenerToken(): string | null {
        return sessionStorage.getItem(TOKEN_KEY);
    },

    // Comprobar si existe un token
    haySesion(): boolean {
        return Boolean(sessionStorage.getItem(TOKEN_KEY));
    },

    // Cerrar sesión
    cerrarSesion(): void {
        sessionStorage.removeItem(TOKEN_KEY);
    }

};
