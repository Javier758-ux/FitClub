import type { MembresiaFormData } from '../types/MembresiaFormData';

export type MembresiaFormErrors = Partial<Record<keyof MembresiaFormData, string>>;

const TIPOS_VALIDOS = ['MENSUAL', 'TRIMESTRAL', 'ANUAL'];

export function validarMembresia(data: MembresiaFormData): MembresiaFormErrors {
    const errors: MembresiaFormErrors = {};

    if (!data.tipo.trim()) {
        errors.tipo = 'El tipo de membresía es obligatorio.';
    } else if (!TIPOS_VALIDOS.includes(data.tipo)) {
        errors.tipo = 'El tipo debe ser Mensual, Trimestral o Anual.';
    }

    if (!data.fechaInicio) {
        errors.fechaInicio = 'La fecha de inicio es obligatoria.';
    }

    if (!data.fechaFin) {
        errors.fechaFin = 'La fecha de fin es obligatoria.';
    } else if (data.fechaInicio && data.fechaFin < data.fechaInicio) {
        errors.fechaFin = 'La fecha de fin no puede ser anterior a la de inicio.';
    }

    if (!data.precio.trim()) {
        errors.precio = 'El precio es obligatorio.';
    } else if (Number.isNaN(Number(data.precio)) || Number(data.precio) <= 0) {
        errors.precio = 'El precio debe ser un número mayor a 0.';
    }

    if (!data.socioId) {
        errors.socioId = 'Debes seleccionar un socio.';
    }

    return errors;
}