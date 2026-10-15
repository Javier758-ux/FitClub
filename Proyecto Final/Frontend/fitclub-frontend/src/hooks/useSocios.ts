import {
    useAsyncList
} from "./useAsyncList";

import {
    socioService
} from "../services/socioService";

import type {
    SocioApi
} from "../models/ApiModels";

async function cargarSocios(
    signal: AbortSignal
): Promise<SocioApi[]> {
    const pagina =
        await socioService.listar(
            0,
            100,
            signal
        );

    return pagina.contenido;
}

export function useSocios() {
    return useAsyncList<SocioApi>(
        cargarSocios
    );
}