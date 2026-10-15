import type { Socio } from '../models/Socio';

interface SocioTableProps {
    socios: Socio[];
}

function SocioTable({ socios }: SocioTableProps) {
    return (
        <table>
            <thead>
            <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Teléfono</th>
                <th>Fecha de registro</th>
            </tr>
            </thead>
            <tbody>
            {socios.map((socio) => (
                <tr key={socio.id}>
                    <td>{socio.nombre}</td>
                    <td>{socio.email}</td>
                    <td>{socio.telefono}</td>
                    <td>{socio.fechaRegistro}</td>
                </tr>
            ))}
            </tbody>
        </table>
    );
}

export default SocioTable;