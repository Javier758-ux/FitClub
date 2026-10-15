import {
    apiClient
} from "./apiClient";

import type {
    MembresiaRequest
} from "../models/ApiModels";

import type {
    EstadoMembresia,
    Membresia
} from "../models/Membresia";

function construirQuery(
    socioId?: number,
    estado?: EstadoMembresia
): string {

    const params =
        new URLSearchParams();

    if (
        socioId !== undefined
    ) {

        params.set(
            "socioId",
            String(
                socioId
            )
        );
    }

    if (estado) {

        params.set(
            "estado",
            estado
        );
    }

    const query =
        params.toString();

    return query
        ? `?${query}`
        : "";
}

export const membresiaService = {

    listar(
        socioId?: number,
        estado?: EstadoMembresia,
        signal?: AbortSignal
    ): Promise<Membresia[]> {

        return apiClient.get<Membresia[]>(
            `/membresias${construirQuery(
                socioId,
                estado
            )}`,
            signal
        );
    },

    listarMias(
        signal?: AbortSignal
    ): Promise<Membresia[]> {

        return apiClient.get<Membresia[]>(
            "/membresias/mias",
            signal
        );
    },

    buscarPorId(
        id: number,
        signal?: AbortSignal
    ): Promise<Membresia> {

        return apiClient.get<Membresia>(
            `/membresias/${id}`,
            signal
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

    suspender(
        id: number
    ): Promise<Membresia> {

        return apiClient.patch<Membresia>(
            `/membresias/${id}/suspender`,
            {}
        );
    },

    cancelar(
        id: number
    ): Promise<Membresia> {

        return apiClient.patch<Membresia>(
            `/membresias/${id}/cancelar`,
            {}
        );
    },

    reactivar(
        id: number
    ): Promise<Membresia> {

        return apiClient.patch<Membresia>(
            `/membresias/${id}/reactivar`,
            {}
        );
    }

};