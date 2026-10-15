import { useState, type ChangeEvent, type FormEvent } from 'react';
import type { MembresiaFormData } from '../types/MembresiaFormData';
import { validarMembresia, type MembresiaFormErrors } from '../utils/membresiaValidation';
import { createMembresia } from '../services/membresiaService';
import type { Socio } from '../../socios/models/Socio';

const initialMembresiaForm: MembresiaFormData = {
    tipo: '',
    fechaInicio: '',
    fechaFin: '',
    precio: '',
    socioId: '',
};

interface MembresiaFormProps {
    socios: Socio[];
    onMembresiaCreada: () => void;
}

function MembresiaForm({ socios, onMembresiaCreada }: MembresiaFormProps) {
    const [formData, setFormData] = useState<MembresiaFormData>(initialMembresiaForm);
    const [errors, setErrors] = useState<MembresiaFormErrors>({});
    const [mensaje, setMensaje] = useState('');
    const [enviando, setEnviando] = useState(false);

    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setMensaje('');

        const validationErrors = validarMembresia(formData);
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) {
            return;
        }

        setEnviando(true);
        try {
            await createMembresia(formData);
            setMensaje('Membresía guardada correctamente.');
            setFormData(initialMembresiaForm);
            onMembresiaCreada();
        } catch {
            setMensaje('Ocurrió un error al guardar la membresía.');
        } finally {
            setEnviando(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} noValidate>
            <label>
                Tipo
                <select name="tipo" value={formData.tipo} onChange={handleChange}>
                    <option value="">Seleccione un tipo</option>
                    <option value="MENSUAL">Mensual</option>
                    <option value="TRIMESTRAL">Trimestral</option>
                    <option value="ANUAL">Anual</option>
                </select>
                {errors.tipo && <small>{errors.tipo}</small>}
            </label>

            <label>
                Precio
                <input type="number" name="precio" value={formData.precio} onChange={handleChange} />
                {errors.precio && <small>{errors.precio}</small>}
            </label>

            <label>
                Fecha de inicio
                <input type="date" name="fechaInicio" value={formData.fechaInicio} onChange={handleChange} />
                {errors.fechaInicio && <small>{errors.fechaInicio}</small>}
            </label>

            <label>
                Fecha de fin
                <input type="date" name="fechaFin" value={formData.fechaFin} onChange={handleChange} />
                {errors.fechaFin && <small>{errors.fechaFin}</small>}
            </label>

            <label>
                Socio
                <select name="socioId" value={formData.socioId} onChange={handleChange}>
                    <option value="">Seleccione un socio</option>
                    {socios.map((socio) => (
                        <option key={socio.id} value={socio.id}>
                            {socio.nombre}
                        </option>
                    ))}
                </select>
                {errors.socioId && <small>{errors.socioId}</small>}
            </label>

            {mensaje && <div>{mensaje}</div>}

            <button type="submit" disabled={enviando}>
                {enviando ? 'Guardando...' : 'Guardar membresía'}
            </button>
        </form>
    );
}

export default MembresiaForm;