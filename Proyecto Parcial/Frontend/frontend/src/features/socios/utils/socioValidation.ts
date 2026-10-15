import type { SocioFormData } from '../types/SocioFormData';

export type SocioFormErrors = Partial<Record<keyof SocioFormData, string>>;

export function validarSocio(data: SocioFormData): SocioFormErrors {
    const errors: SocioFormErrors = {};

    if (!data.nombre.trim()) {
        errors.nombre = 'El nombre es obligatorio.';
    }

    if (!data.email.trim()) {
        errors.email = 'El email es obligatorio.';
    } else if (!data.email.includes('@')) {
        errors.email = 'El email no es válido.';
    }

    if (!data.telefono.trim()) {
        errors.telefono = 'El teléfono es obligatorio.';
    } else if (!/^\d{7,10}$/.test(data.telefono.trim())) {
        errors.telefono = 'El teléfono debe tener entre 7 y 10 dígitos, sin espacios ni guiones.';
    }

    return errors;
}