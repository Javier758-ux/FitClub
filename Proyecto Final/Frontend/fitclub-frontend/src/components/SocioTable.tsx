import type {
    SocioApi
} from "../models/ApiModels";

import {
    Button
} from "./ui/Button";

interface SocioTableProps {
    socios: SocioApi[];

    onEditar:
        (id: number) => void;

    onEliminar:
        (socio: SocioApi) => void;

    cargandoDetalle: boolean;

    eliminandoId:
        number | null;

    permiteEliminar: boolean;
}

export default function SocioTable({
                                       socios,
                                       onEditar,
                                       onEliminar,
                                       cargandoDetalle,
                                       eliminandoId,
                                       permiteEliminar
                                   }: SocioTableProps) {

    return (
        <div className="socios-crud__table-wrapper">

            <table className="socios-crud__table">

                <thead>
                <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Correo</th>
                    <th>Teléfono</th>
                    <th>Fecha registro</th>
                    <th>Acciones</th>
                </tr>
                </thead>

                <tbody>

                {socios.map((socio) => (

                    <tr key={socio.id}>

                        <td>{socio.id}</td>

                        <td>
                            {socio.nombre}
                        </td>

                        <td>
                            {socio.email}
                        </td>

                        <td>
                            {socio.telefono}
                        </td>

                        <td>
                            {socio.fechaRegistro}
                        </td>

                        <td>
                            <div className="socios-crud__actions">

                                <Button
                                    type="button"
                                    variant="ghost"
                                    disabled={
                                        cargandoDetalle ||
                                        eliminandoId !== null
                                    }
                                    onClick={() =>
                                        onEditar(socio.id)
                                    }
                                >
                                    Editar
                                </Button>

                                <Button
                                    type="button"
                                    variant="danger"
                                    disabled={
                                        !permiteEliminar ||
                                        cargandoDetalle ||
                                        eliminandoId !== null
                                    }
                                    title={
                                        permiteEliminar
                                            ? "Eliminar socio"
                                            : "DELETE todavía no existe en Spring Boot"
                                    }
                                    onClick={() =>
                                        onEliminar(socio)
                                    }
                                >
                                    {eliminandoId === socio.id
                                        ? "Eliminando..."
                                        : "Eliminar"}
                                </Button>

                            </div>
                        </td>

                    </tr>

                ))}

                </tbody>
            </table>
        </div>
    );
}