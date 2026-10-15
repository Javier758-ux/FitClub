import {
    API_URL
} from "../config/env";

import {
    isAbortError
} from "../utils/isAbortError";

export class ApiError
    extends Error {

    public readonly status: number;

    constructor(
        status: number,
        mensaje: string
    ) {
        super(mensaje);

        this.name =
            "ApiError";

        this.status =
            status;
    }
}

function obtenerMensajeError(
    status: number,
    datos: unknown
): string {

    if (
        datos &&
        typeof datos === "object"
    ) {

        const error =
            datos as Record<
                string,
                unknown
            >;

        const mensaje =
            typeof error.message ===
            "string"
                ? error.message
                : `Error HTTP ${status}`;

        const campos =
            Array.isArray(
                error.fieldErrors
            )
                ? error.fieldErrors.filter(
                    (
                        item
                    ): item is string =>
                        typeof item ===
                        "string"
                )
                : [];

        return campos.length > 0
            ? `${mensaje}: ${campos.join("; ")}`
            : mensaje;
    }

    if (status === 401) {
        return (
            "Sesión inválida o vencida. " +
            "Inicia sesión nuevamente."
        );
    }

    if (status === 403) {
        return (
            "Tu usuario no tiene permiso " +
            "para realizar esta acción."
        );
    }

    if (status === 404) {
        return (
            "El recurso solicitado no existe."
        );
    }

    if (status === 409) {
        return (
            "La operación entra en conflicto " +
            "con los datos existentes."
        );
    }

    if (status >= 500) {
        return (
            "Ocurrió un error en el servidor."
        );
    }

    return `Error HTTP ${status}`;
}

async function request<T>(
    ruta: string,
    opciones: RequestInit = {}
): Promise<T> {

    const token =
        sessionStorage.getItem(
            "fitclub_token"
        );

    const headers =
        new Headers(
            opciones.headers
        );

    headers.set(
        "Accept",
        "application/json"
    );

    if (
        opciones.body &&
        !headers.has(
            "Content-Type"
        )
    ) {
        headers.set(
            "Content-Type",
            "application/json"
        );
    }

    if (token) {
        headers.set(
            "Authorization",
            `Bearer ${token}`
        );
    }

    const url =
        `${API_URL}/${ruta.replace(/^\//, "")}`;

    let respuesta: Response;

    try {

        respuesta =
            await fetch(
                url,
                {
                    ...opciones,
                    headers
                }
            );

    } catch (error) {

        if (
            isAbortError(error)
        ) {
            throw error;
        }

        throw new Error(
            "No se pudo conectar con Spring Boot. " +
            "Comprueba que el backend esté encendido."
        );
    }

    const texto =
        await respuesta.text();

    let datos: unknown =
        null;

    if (texto) {

        try {
            datos =
                JSON.parse(
                    texto
                ) as unknown;

        } catch {
            datos =
                texto;
        }
    }

    if (!respuesta.ok) {

        throw new ApiError(
            respuesta.status,

            obtenerMensajeError(
                respuesta.status,
                datos
            )
        );
    }

    if (
        respuesta.status ===
        204 ||
        !texto
    ) {
        return undefined as T;
    }

    return datos as T;
}

export const apiClient = {

    get<T>(
        ruta: string,
        signal?: AbortSignal
    ): Promise<T> {

        return request<T>(
            ruta,
            {
                method: "GET",
                signal
            }
        );
    },

    post<T>(
        ruta: string,
        datos: unknown,
        signal?: AbortSignal
    ): Promise<T> {

        return request<T>(
            ruta,
            {
                method: "POST",
                body:
                    JSON.stringify(
                        datos
                    ),
                signal
            }
        );
    },

    put<T>(
        ruta: string,
        datos: unknown,
        signal?: AbortSignal
    ): Promise<T> {

        return request<T>(
            ruta,
            {
                method: "PUT",
                body:
                    JSON.stringify(
                        datos
                    ),
                signal
            }
        );
    },

    patch<T>(
        ruta: string,
        datos: unknown,
        signal?: AbortSignal
    ): Promise<T> {

        return request<T>(
            ruta,
            {
                method: "PATCH",
                body:
                    JSON.stringify(
                        datos
                    ),
                signal
            }
        );
    },

    delete<T>(
        ruta: string,
        signal?: AbortSignal
    ): Promise<T> {

        return request<T>(
            ruta,
            {
                method: "DELETE",
                signal
            }
        );
    }

};