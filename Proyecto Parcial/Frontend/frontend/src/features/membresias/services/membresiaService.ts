import { apiClient } from '../../../api/apiClient';
import type { Membresia } from '../models/Membresia';
import type { MembresiaFormData } from '../types/MembresiaFormData';

export function getMembresias(signal?: AbortSignal): Promise<Membresia[]> {
    return apiClient.get<Membresia[]>('/membresias', signal);
}

export function createMembresia(data: MembresiaFormData): Promise<Membresia> {
    return apiClient.post<Membresia>('/membresias', {
        tipo: data.tipo,
        fechaInicio: data.fechaInicio,
        fechaFin: data.fechaFin,
        precio: Number(data.precio),
        socioId: Number(data.socioId),
    });
}

// Nota: el backend de FitClub no implementa PUT ni DELETE para Membresia
// (decisión documentada: no está pedido por la ficha oficial del proyecto).
// Por eso este service solo expone listar y crear; no hay actualizar/eliminar.