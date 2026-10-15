import { apiClient } from "./apiClient";

import type {
    SocioApi,
    SocioRequest,
    PaginaResponse
} from "../models/ApiModels";

export const socioService = {
    listar(
        pagina = 0,
        tamanio = 100,
        signal?: AbortSignal
    ): Promise<PaginaResponse<SocioApi>> {
        return apiClient.get<
            PaginaResponse<SocioApi>
        >(
            `/socios?pagina=${pagina}&tamanio=${tamanio}`,
            signal
        );
    },

    buscarPorId(
        id: number,
        signal?: AbortSignal
    ): Promise<SocioApi> {
        return apiClient.get<SocioApi>(
            `/socios/${id}`,
            signal
        );
    },

    crear(
        datos: SocioRequest
    ): Promise<SocioApi> {
        return apiClient.post<SocioApi>(
            "/socios",
            datos
        );
    },

    actualizar(
        id: number,
        datos: SocioRequest
    ): Promise<SocioApi> {
        return apiClient.put<SocioApi>(
            `/socios/${id}`,
            datos
        );
    },

    eliminar(
        id: number
    ): Promise<void> {
        return apiClient.delete<void>(
            `/socios/${id}`
        );
    }
};