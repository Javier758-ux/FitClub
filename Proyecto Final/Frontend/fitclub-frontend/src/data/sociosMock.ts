
import type { Socio } from "../models/Socio";

export const sociosMock: Socio[] = [
    {
        id: 1,
        nombre: "Carlos",
        apellido: "Pérez",
        correo: "carlos@email.com",
        telefono: "70000001",
        activo: true
    },
    {
        id: 2,
        nombre: "María",
        apellido: "López",
        correo: "maria@email.com",
        telefono: "70000002",
        activo: true
    },
    {
        id: 3,
        nombre: "Pedro",
        apellido: "Gómez",
        correo: "pedro@email.com",
        telefono: "70000003",
        activo: false
    }
];
