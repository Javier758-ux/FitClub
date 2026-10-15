import { describe, expect, it } from 'vitest';
import { validarSocio } from './socioValidation';

describe('validarSocio', () => {
    it('no devuelve errores con datos válidos', () => {
        const errores = validarSocio({
            nombre: 'Ana Torres',
            email: 'ana@example.com',
            telefono: '0991234567',
        });

        expect(errores).toEqual({});
    });

    it('exige un email con arroba', () => {
        const errores = validarSocio({
            nombre: 'Ana Torres',
            email: 'ana-sin-arroba',
            telefono: '0991234567',
        });

        expect(errores.email).toBe('El email no es válido.');
    });

    it('exige un teléfono de entre 7 y 10 dígitos', () => {
        const errores = validarSocio({
            nombre: 'Ana Torres',
            email: 'ana@example.com',
            telefono: '123',
        });

        expect(errores.telefono).toBeDefined();
    });
});