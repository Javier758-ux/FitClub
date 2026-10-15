import { apiClient } from '../../../api/apiClient';
import type { Socio } from '../models/Socio';
import type { SocioFormData } from '../types/SocioFormData';

export function getSocios(signal?: AbortSignal): Promise<Socio[]> {
    return apiClient.get<Socio[]>('/socios', signal);
}

export function createSocio(data: SocioFormData): Promise<Socio> {
    return apiClient.post<Socio>('/socios', {
        nombre: data.nombre,
        email: data.email,
        telefono: data.telefono,
    });
}

// Nota: el backend de FitClub no implementa PUT ni DELETE para Socio
// (decisión documentada: no está pedido por la ficha oficial del proyecto).
// Por eso este service solo expone listar y crear; no hay actualizar/eliminar.