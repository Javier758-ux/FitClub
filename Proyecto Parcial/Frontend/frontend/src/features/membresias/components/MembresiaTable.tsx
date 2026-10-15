import type { Membresia } from '../models/Membresia';
import type { Socio } from '../../socios/models/Socio';

interface MembresiaTableProps {
    membresias: Membresia[];
    socios: Socio[];
}

function MembresiaTable({ membresias, socios }: MembresiaTableProps) {
    const sociosPorId = new Map(socios.map((socio) => [socio.id, socio]));
    return (
        <table>
            <thead>
            <tr>
                <th>Tipo</th>
                <th>Socio</th>
                <th>Fecha de inicio</th>
                <th>Fecha de fin</th>
                <th>Precio</th>
            </tr>
            </thead>
            <tbody>
            {membresias.map((membresia) => {
                const socio = sociosPorId.get(membresia.socioId);
                return (
                    <tr key={membresia.id}>
                        <td>{membresia.tipo}</td>
                        <td>{socio ? socio.nombre : 'Sin socio asociado'}</td>
                        <td>{membresia.fechaInicio}</td>
                        <td>{membresia.fechaFin}</td>
                        <td>{membresia.precio}</td>
                    </tr>
                );
            })}
            </tbody>
        </table>
    );
}

export default MembresiaTable;