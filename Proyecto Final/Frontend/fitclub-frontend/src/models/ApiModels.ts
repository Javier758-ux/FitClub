export interface SocioApi {
    id: number;
    nombre: string;
    email: string;
    telefono: string;
    fechaRegistro: string;
}

export type SocioRequest = Pick<
    SocioApi,
    "nombre" | "email" | "telefono"
>;

export interface PaginaResponse<T> {
    contenido: T[];
    pagina: number;
    tamanio: number;
    totalElementos: number;
    totalPaginas: number;
}

export interface MembresiaRequest {
    socioId: number;
    planId: number;
    fechaInicio: string;
}

export interface ClaseApi {
    id: number;
    nombre: string;
    descripcion: string;
    cupoMaximo: number;
}

export interface InstructorApi {
    id: number;
    nombre: string;
    email: string;
    telefono: string;
    especialidad: string;
}

export interface HorarioApi {
    id: number;
    claseId: number;
    instructorId: number;
    fecha: string;
    horaInicio: string;
    horaFin: string;
}

export interface HorarioRequest {
    claseId: number;
    instructorId: number;
    fecha: string;
    horaInicio: string;
    horaFin: string;
}

export type EstadoReserva =
    | "ACTIVA"
    | "CANCELADA";

export interface ReservaApi {
    id: number;
    socioId: number;
    horarioClaseId: number;
    fechaReserva: string;
    estado: EstadoReserva;
    fechaCancelacion: string | null;
    cancelacionTardia: boolean;
}

export interface ReservaRequest {
    socioId: number;
    horarioClaseId: number;
}

export interface ReservaPropiaRequest {
    horarioClaseId: number;
}

export interface AsistenciaApi {
    id: number;
    reservaClaseId: number;
    fechaRegistro: string;
    presente: boolean;
}

export interface AsistenciaRequest {
    reservaClaseId: number;
    presente: boolean;
}

export interface ReporteOcupacionApi {
    horarioId: number;
    claseId: number;
    clase: string;
    cupoMaximo: number;
    reservasActivas: number;
    cuposDisponibles: number;
    porcentajeOcupacion: number;
}

export interface NotificacionApi {
    id: number;
    socioId: number;
    titulo: string;
    mensaje: string;
    fechaEnvio: string;
    leida: boolean;
}

export interface NotificacionRequest {
    socioId: number;
    titulo: string;
    mensaje: string;
}