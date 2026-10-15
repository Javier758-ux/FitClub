import {
    useAsyncList
} from "./useAsyncList";

import {
    planService
} from "../services/planService";

import type {
    Plan
} from "../models/Plan";

async function cargarPlanes(
    signal: AbortSignal
): Promise<Plan[]> {
    return planService.listar(
        signal
    );
}

export function usePlanes() {
    return useAsyncList<Plan>(
        cargarPlanes
    );
}