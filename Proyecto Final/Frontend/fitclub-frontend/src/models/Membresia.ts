export type EstadoMembresia =
    | "ACTIVA"
    | "VENCIDA"
    | "SUSPENDIDA"
    | "CANCELADA";

export interface Membresia {
    id: number;
    socioId: number;
    planId: number;
    fechaInicio: string;
    fechaFin: string;
    estado: EstadoMembresia;
}
