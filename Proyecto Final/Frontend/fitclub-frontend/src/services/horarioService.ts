import { apiClient } from "./apiClient";

import type {
    HorarioApi,
    HorarioRequest
} from "../models/ApiModels";

export const horarioService = {
    listar(
        signal?: AbortSignal
    ): Promise<HorarioApi[]> {
        return apiClient.get<HorarioApi[]>(
            "/horarios",
            signal
        );
    },

    listarMios(
        fecha: string,
        signal?: AbortSignal
    ): Promise<HorarioApi[]> {
        return apiClient.get<HorarioApi[]>(
            `/horarios/mios?fecha=${encodeURIComponent(fecha)}`,
            signal
        );
    },

    buscarPorId(
        id: number,
        signal?: AbortSignal
    ): Promise<HorarioApi> {
        return apiClient.get<HorarioApi>(
            `/horarios/${id}`,
            signal
        );
    },

    crear(
        datos: HorarioRequest
    ): Promise<HorarioApi> {
        return apiClient.post<HorarioApi>(
            "/horarios",
            datos
        );
    },

    actualizar(
        id: number,
        datos: HorarioRequest
    ): Promise<HorarioApi> {
        return apiClient.put<HorarioApi>(
            `/horarios/${id}`,
            datos
        );
    }
};