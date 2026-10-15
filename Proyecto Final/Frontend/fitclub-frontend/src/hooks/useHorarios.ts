import {
    useAsyncList
} from "./useAsyncList";

import {
    horarioService
} from "../services/horarioService";

import type {
    HorarioApi
} from "../models/ApiModels";

async function cargarHorarios(
    signal: AbortSignal
): Promise<HorarioApi[]> {
    return horarioService.listar(
        signal
    );
}

export function useHorarios() {
    return useAsyncList<HorarioApi>(
        cargarHorarios
    );
}