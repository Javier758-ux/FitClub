import { apiClient } from "./apiClient";

import type {
    InstructorApi,
    PaginaResponse
} from "../models/ApiModels";

export interface InstructorRequest {
    nombre: string;
    email: string;
    telefono: string;
    especialidad: string;
}

export const instructorService = {
    listar(
        pagina = 0,
        tamanio = 100,
        signal?: AbortSignal
    ): Promise<PaginaResponse<InstructorApi>> {
        return apiClient.get<PaginaResponse<InstructorApi>>(
            `/instructores?pagina=${pagina}&tamanio=${tamanio}`,
            signal
        );
    },

    buscarPorId(
        id: number,
        signal?: AbortSignal
    ): Promise<InstructorApi> {
        return apiClient.get<InstructorApi>(
            `/instructores/${id}`,
            signal
        );
    },

    crear(
        datos: InstructorRequest
    ): Promise<InstructorApi> {
        return apiClient.post<InstructorApi>(
            "/instructores",
            datos
        );
    },

    actualizar(
        id: number,
        datos: InstructorRequest
    ): Promise<InstructorApi> {
        return apiClient.put<InstructorApi>(
            `/instructores/${id}`,
            datos
        );
    }
};