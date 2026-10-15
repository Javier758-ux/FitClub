import {
    apiClient
} from "./apiClient";

import type {
    HistorialMembresiaApi
} from "../models/ApiModels";

export const historialMembresiaService = {

    listar(
        signal?: AbortSignal
    ): Promise<HistorialMembresiaApi[]> {

        return apiClient.get<
            HistorialMembresiaApi[]
        >(
            "/historial-membresias",
            signal
        );
    },

    buscarPorId(
        id: number,
        signal?: AbortSignal
    ): Promise<HistorialMembresiaApi> {

        return apiClient.get<
            HistorialMembresiaApi
        >(
            `/historial-membresias/${id}`,
            signal
        );
    }

};