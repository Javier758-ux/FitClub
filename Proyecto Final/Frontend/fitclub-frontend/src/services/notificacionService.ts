import { apiClient } from "./apiClient";

import type {
    NotificacionApi,
    NotificacionRequest
} from "../models/ApiModels";

export const notificacionService = {

    listar(
        socioId?: number,
        signal?: AbortSignal
    ): Promise<NotificacionApi[]> {

        const query =
            socioId !== undefined
                ? `?socioId=${socioId}`
                : "";

        return apiClient.get<NotificacionApi[]>(
            `/notificaciones${query}`,
            signal
        );
    },

    listarMias(
        signal?: AbortSignal
    ): Promise<NotificacionApi[]> {

        return apiClient.get<NotificacionApi[]>(
            "/notificaciones/mias",
            signal
        );
    },

    crear(
        datos: NotificacionRequest
    ): Promise<NotificacionApi> {

        return apiClient.post<NotificacionApi>(
            "/notificaciones",
            datos
        );
    },

    marcarComoLeida(
        id: number
    ): Promise<NotificacionApi> {

        return apiClient.patch<NotificacionApi>(
            `/notificaciones/${id}/leer`,
            {}
        );
    },

    marcarPropiaComoLeida(
        id: number
    ): Promise<NotificacionApi> {

        return apiClient.patch<NotificacionApi>(
            `/notificaciones/mias/${id}/leer`,
            {}
        );
    }

};