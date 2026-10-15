import { apiClient } from "./apiClient";

import type {
    ReservaApi,
    ReservaPropiaRequest,
    ReservaRequest
} from "../models/ApiModels";

export const reservaService = {
    listar(
        signal?: AbortSignal
    ): Promise<ReservaApi[]> {
        return apiClient.get<ReservaApi[]>(
            "/reservas",
            signal
        );
    },

    buscarPorId(
        id: number,
        signal?: AbortSignal
    ): Promise<ReservaApi> {
        return apiClient.get<ReservaApi>(
            `/reservas/${id}`,
            signal
        );
    },

    crear(
        datos: ReservaRequest
    ): Promise<ReservaApi> {
        return apiClient.post<ReservaApi>(
            "/reservas",
            datos
        );
    },

    listarMias(
        signal?: AbortSignal
    ): Promise<ReservaApi[]> {
        return apiClient.get<ReservaApi[]>(
            "/reservas/mias",
            signal
        );
    },

    crearMia(
        datos: ReservaPropiaRequest
    ): Promise<ReservaApi> {
        return apiClient.post<ReservaApi>(
            "/reservas/mias",
            datos
        );
    },

    cancelar(
        id: number
    ): Promise<ReservaApi> {
        return apiClient.patch<ReservaApi>(
            `/reservas/${id}/cancelar`,
            {}
        );
    },

    cancelarMia(
        id: number
    ): Promise<ReservaApi> {
        return apiClient.patch<ReservaApi>(
            `/reservas/mias/${id}/cancelar`,
            {}
        );
    },

    listarPorSocio(
        socioId: number,
        signal?: AbortSignal
    ): Promise<ReservaApi[]> {
        return apiClient.get<ReservaApi[]>(
            `/reservas/socio/${socioId}`,
            signal
        );
    },

    listarActivasPorHorario(
        horarioClaseId: number,
        signal?: AbortSignal
    ): Promise<ReservaApi[]> {
        return apiClient.get<ReservaApi[]>(
            `/reservas/horario/${horarioClaseId}`,
            signal
        );
    },

    participantesDeMiClase(
        horarioClaseId: number,
        signal?: AbortSignal
    ): Promise<ReservaApi[]> {
        return apiClient.get<ReservaApi[]>(
            `/reservas/mis-clases/${horarioClaseId}`,
            signal
        );
    }
};