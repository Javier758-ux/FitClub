import { apiClient } from "./apiClient";

import type {
    ClaseApi,
    PaginaResponse
} from "../models/ApiModels";

export interface ClaseRequest {
    nombre: string;
    descripcion: string;
    cupoMaximo: number;
}

export const claseService = {
    listar(
        pagina = 0,
        tamanio = 100,
        signal?: AbortSignal
    ): Promise<PaginaResponse<ClaseApi>> {
        return apiClient.get<PaginaResponse<ClaseApi>>(
            `/clases?pagina=${pagina}&tamanio=${tamanio}`,
            signal
        );
    },

    buscarPorId(
        id: number,
        signal?: AbortSignal
    ): Promise<ClaseApi> {
        return apiClient.get<ClaseApi>(
            `/clases/${id}`,
            signal
        );
    },

    crear(
        datos: ClaseRequest
    ): Promise<ClaseApi> {
        return apiClient.post<ClaseApi>(
            "/clases",
            datos
        );
    },

    actualizar(
        id: number,
        datos: ClaseRequest
    ): Promise<ClaseApi> {
        return apiClient.put<ClaseApi>(
            `/clases/${id}`,
            datos
        );
    }
};