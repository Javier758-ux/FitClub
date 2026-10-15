import { apiClient } from "./apiClient";
import type { Membresia } from "../models/Membresia";
import type { MembresiaRequest } from "../models/ApiModels";

export const membresiaService = {
    listar(): Promise<Membresia[]> {
        return apiClient.get<Membresia[]>("/membresias");
    },

    buscarPorId(id: number): Promise<Membresia> {
        return apiClient.get<Membresia>(
            `/membresias/${id}`
        );
    },

    crear(
        datos: MembresiaRequest
    ): Promise<Membresia> {
        return apiClient.post<Membresia>(
            "/membresias",
            datos
        );
    },

    suspender(id: number): Promise<Membresia> {
        return apiClient.patch<Membresia>(
            `/membresias/${id}/suspender`,
            {}
        );
    },

    cancelar(id: number): Promise<Membresia> {
        return apiClient.patch<Membresia>(
            `/membresias/${id}/cancelar`,
            {}
        );
    },

    reactivar(id: number): Promise<Membresia> {
        return apiClient.patch<Membresia>(
            `/membresias/${id}/reactivar`,
            {}
        );
    }
};
