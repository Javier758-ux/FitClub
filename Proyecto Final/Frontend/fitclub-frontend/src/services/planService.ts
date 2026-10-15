import { apiClient } from "./apiClient";

import type {
    Plan
} from "../models/Plan";

export interface PlanRequest {
    nombre: string;
    descripcion: string;
    precio: number;
    duracionDias: number;
}

export const planService = {
    listar(
        signal?: AbortSignal
    ): Promise<Plan[]> {
        return apiClient.get<Plan[]>(
            "/planes",
            signal
        );
    },

    buscarPorId(
        id: number,
        signal?: AbortSignal
    ): Promise<Plan> {
        return apiClient.get<Plan>(
            `/planes/${id}`,
            signal
        );
    },

    crear(
        datos: PlanRequest
    ): Promise<Plan> {
        return apiClient.post<Plan>(
            "/planes",
            datos
        );
    },

    actualizar(
        id: number,
        datos: PlanRequest
    ): Promise<Plan> {
        return apiClient.put<Plan>(
            `/planes/${id}`,
            datos
        );
    }
};