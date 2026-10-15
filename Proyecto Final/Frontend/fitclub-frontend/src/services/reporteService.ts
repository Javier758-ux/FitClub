import { apiClient } from "./apiClient";

import type {
    ReporteOcupacionApi
} from "../models/ApiModels";

export const reporteService = {

    obtenerOcupacionPorHorario(
        horarioId: number,
        signal?: AbortSignal
    ): Promise<ReporteOcupacionApi> {

        return apiClient.get<ReporteOcupacionApi>(
            `/reportes/ocupacion/horario/${horarioId}`,
            signal
        );
    }

};