import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { EmptyState } from './EmptyState';

describe('EmptyState', () => {
    it('muestra el título recibido', () => {
        render(<EmptyState title="No se encontraron socios" />);
        expect(screen.getByText('No se encontraron socios')).toBeInTheDocument();
    });

    it('muestra la descripción cuando se recibe', () => {
        render(<EmptyState title="Sin resultados" description="Prueba otra búsqueda." />);
        expect(screen.getByText('Prueba otra búsqueda.')).toBeInTheDocument();
    });
});