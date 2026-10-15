import type {
    RolUsuario
} from "../services/authService";

export const TODOS_LOS_ROLES:
    readonly RolUsuario[] = [
    "ADMINISTRADOR",
    "RECEPCION",
    "INSTRUCTOR",
    "SOCIO"
];

export const PERMISOS_RUTA = {

    dashboard:
    TODOS_LOS_ROLES,

    socios: [
        "ADMINISTRADOR",
        "RECEPCION"
    ],

    planes:
    TODOS_LOS_ROLES,

    membresias: [
        "ADMINISTRADOR",
        "RECEPCION"
    ],

    instructores:
    TODOS_LOS_ROLES,

    clases:
    TODOS_LOS_ROLES,

    horarios:
    TODOS_LOS_ROLES,

    reservas: [
        "ADMINISTRADOR",
        "RECEPCION",
        "SOCIO"
    ],

    asistencias: [
        "ADMINISTRADOR",
        "RECEPCION",
        "INSTRUCTOR"
    ],

    notificaciones: [
        "ADMINISTRADOR",
        "RECEPCION",
        "SOCIO"
    ],

    reportes: [
        "ADMINISTRADOR",
        "RECEPCION",
        "INSTRUCTOR"
    ]

} satisfies Record<
    string,
    readonly RolUsuario[]
>;

export interface MenuItem {
    path: string;
    label: string;
    roles: readonly RolUsuario[];
}

export const MENU_ITEMS:
    readonly MenuItem[] = [

    {
        path: "/",
        label: "Dashboard",
        roles:
        PERMISOS_RUTA.dashboard
    },

    {
        path: "/socios",
        label: "Socios",
        roles:
        PERMISOS_RUTA.socios
    },

    {
        path: "/planes",
        label: "Planes",
        roles:
        PERMISOS_RUTA.planes
    },

    {
        path: "/membresias",
        label: "Membresías",
        roles:
        PERMISOS_RUTA.membresias
    },

    {
        path: "/instructores",
        label: "Instructores",
        roles:
        PERMISOS_RUTA.instructores
    },

    {
        path: "/clases",
        label: "Clases",
        roles:
        PERMISOS_RUTA.clases
    },

    {
        path: "/horarios",
        label: "Horarios",
        roles:
        PERMISOS_RUTA.horarios
    },

    {
        path: "/reservas",
        label: "Reservas",
        roles:
        PERMISOS_RUTA.reservas
    },

    {
        path: "/asistencias",
        label: "Asistencias",
        roles:
        PERMISOS_RUTA.asistencias
    },

    {
        path: "/notificaciones",
        label: "Notificaciones",
        roles:
        PERMISOS_RUTA.notificaciones
    },

    {
        path: "/reportes",
        label: "Reportes",
        roles:
        PERMISOS_RUTA.reportes
    }
];

export function tienePermiso(
    rol: RolUsuario,
    rolesPermitidos:
    readonly RolUsuario[]
): boolean {

    return rolesPermitidos.includes(
        rol
    );
}