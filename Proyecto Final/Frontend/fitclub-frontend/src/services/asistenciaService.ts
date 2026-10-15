import { apiClient } from "./apiClient";

import type {
    AsistenciaApi,
    AsistenciaRequest
} from "../models/ApiModels";

export const asistenciaService = {

    listar(
        signal?: AbortSignal
    ): Promise<AsistenciaApi[]> {

        return apiClient.get<AsistenciaApi[]>(
            "/asistencias",
            signal
        );
    },

    buscarPorId(
        id: number,
        signal?: AbortSignal
    ): Promise<AsistenciaApi> {

        return apiClient.get<AsistenciaApi>(
            `/asistencias/${id}`,
            signal
        );
    },

    registrar(
        datos: AsistenciaRequest
    ): Promise<AsistenciaApi> {

        return apiClient.post<AsistenciaApi>(
            "/asistencias",
            datos
        );
    },

    registrarMiClase(
        datos: AsistenciaRequest
    ): Promise<AsistenciaApi> {

        return apiClient.post<AsistenciaApi>(
            "/asistencias/mis-clases",
            datos
        );
    }

};