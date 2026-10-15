import type { Membresia } from '../models/Membresia';

export const membresiasMock: Membresia[] = [
    {
        id: 1,
        tipo: 'MENSUAL',
        fechaInicio: '2025-01-15',
        fechaFin: '2025-02-15',
        precio: 25,
        socioId: 1,
    },
    {
        id: 2,
        tipo: 'TRIMESTRAL',
        fechaInicio: '2025-02-20',
        fechaFin: '2025-05-20',
        precio: 65,
        socioId: 2,
    },
    {
        id: 3,
        tipo: 'ANUAL',
        fechaInicio: '2025-03-10',
        fechaFin: '2026-03-10',
        precio: 240,
        socioId: 999,
    },
];