import type { Plan } from "../models/Plan";
import type { Membresia } from "../models/Membresia";

export const planesMock: Plan[] = [
    {
        id: 1,
        nombre: "Plan mensual",
        descripcion: "Acceso al gimnasio por un mes",
        precio: 180,
        duracionDias: 30
    },
    {
        id: 2,
        nombre: "Plan trimestral",
        descripcion: "Acceso al gimnasio por tres meses",
        precio: 480,
        duracionDias: 90
    },
    {
        id: 3,
        nombre: "Plan anual",
        descripcion: "Acceso al gimnasio por un año",
        precio: 1700,
        duracionDias: 365
    }
];

export const membresiasMock: Membresia[] = [
    {
        id: 1,
        socioId: 1,
        planId: 1,
        fechaInicio: "2026-10-01",
        fechaFin: "2026-10-31",
        estado: "ACTIVA"
    },
    {
        id: 2,
        socioId: 2,
        planId: 2,
        fechaInicio: "2026-09-01",
        fechaFin: "2026-11-30",
        estado: "ACTIVA"
    },
    {
        id: 3,
        socioId: 3,
        planId: 1,
        fechaInicio: "2026-08-01",
        fechaFin: "2026-08-31",
        estado: "VENCIDA"
    }
];
