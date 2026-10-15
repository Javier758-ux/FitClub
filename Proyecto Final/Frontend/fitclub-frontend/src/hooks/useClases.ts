import {
    useAsyncList
} from "./useAsyncList";

import {
    claseService
} from "../services/claseService";

import type {
    ClaseApi
} from "../models/ApiModels";

async function cargarClases(
    signal: AbortSignal
): Promise<ClaseApi[]> {
    const pagina =
        await claseService.listar(
            0,
            100,
            signal
        );

    return pagina.contenido;
}

export function useClases() {
    return useAsyncList<ClaseApi>(
        cargarClases
    );
}