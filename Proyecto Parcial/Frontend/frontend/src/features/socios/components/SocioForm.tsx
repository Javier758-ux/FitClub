import { useState, type ChangeEvent, type FormEvent } from 'react';
import type { SocioFormData } from '../types/SocioFormData';
import { validarSocio, type SocioFormErrors } from '../utils/socioValidation';
import { createSocio } from '../services/socioService';

const initialSocioForm: SocioFormData = {
    nombre: '',
    email: '',
    telefono: '',
};

interface SocioFormProps {
    onSocioCreado: () => void;
}

function SocioForm({ onSocioCreado }: SocioFormProps) {
    const [formData, setFormData] = useState<SocioFormData>(initialSocioForm);
    const [errors, setErrors] = useState<SocioFormErrors>({});
    const [mensaje, setMensaje] = useState('');
    const [enviando, setEnviando] = useState(false);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setMensaje('');

        const validationErrors = validarSocio(formData);
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) {
            return;
        }

        setEnviando(true);
        try {
            await createSocio(formData);
            setMensaje('Socio guardado correctamente.');
            setFormData(initialSocioForm);
            onSocioCreado();
        } catch {
            setMensaje('Ocurrió un error al guardar el socio.');
        } finally {
            setEnviando(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} noValidate>
            <label>
                Nombre
                <input name="nombre" value={formData.nombre} onChange={handleChange} />
                {errors.nombre && <small>{errors.nombre}</small>}
            </label>

            <label>
                Email
                <input name="email" value={formData.email} onChange={handleChange} />
                {errors.email && <small>{errors.email}</small>}
            </label>

            <label>
                Teléfono
                <input name="telefono" value={formData.telefono} onChange={handleChange} />
                {errors.telefono && <small>{errors.telefono}</small>}
            </label>

            {mensaje && <div>{mensaje}</div>}

            <button type="submit" disabled={enviando}>
                {enviando ? 'Guardando...' : 'Guardar socio'}
            </button>
        </form>
    );
}

export default SocioForm;