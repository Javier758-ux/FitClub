import {
    useAsyncList
} from "./useAsyncList";

import {
    instructorService
} from "../services/instructorService";

import type {
    InstructorApi
} from "../models/ApiModels";

async function cargarInstructores(
    signal: AbortSignal
): Promise<InstructorApi[]> {
    const pagina =
        await instructorService.listar(
            0,
            100,
            signal
        );

    return pagina.contenido;
}

export function useInstructores() {
    return useAsyncList<InstructorApi>(
        cargarInstructores
    );
}