import { useMemo } from "react";

import type {
    ClaseApi,
    HorarioApi,
    InstructorApi
} from "../models/ApiModels";

import { Button } from "./ui/Button";

interface HorarioTableProps {
    horarios: HorarioApi[];
    clases: ClaseApi[];
    instructores: InstructorApi[];

    puedeEditar: boolean;

    onEditar: (id: number) => void;

    cargandoDetalle: boolean;
}

export default function HorarioTable({
                                         horarios,
                                         clases,
                                         instructores,
                                         puedeEditar,
                                         onEditar,
                                         cargandoDetalle
                                     }: HorarioTableProps) {

    const clasesPorId = useMemo(
        () =>
            new Map(
                clases.map(
                    (clase) => [
                        clase.id,
                        clase
                    ]
                )
            ),
        [clases]
    );

    const instructoresPorId = useMemo(
        () =>
            new Map(
                instructores.map(
                    (instructor) => [
                        instructor.id,
                        instructor
                    ]
                )
            ),
        [instructores]
    );

    return (
        <div className="horarios-table-wrapper">

            <table className="horarios-table">

                <thead>

                <tr>
                    <th>ID</th>
                    <th>Clase</th>
                    <th>Instructor</th>
                    <th>Fecha</th>
                    <th>Inicio</th>
                    <th>Fin</th>

                    {puedeEditar && (
                        <th>Acciones</th>
                    )}
                </tr>

                </thead>

                <tbody>

                {horarios.map((horario) => {

                    const clase =
                        clasesPorId.get(
                            horario.claseId
                        );

                    const instructor =
                        instructoresPorId.get(
                            horario.instructorId
                        );

                    return (
                        <tr key={horario.id}>

                            <td>
                                {horario.id}
                            </td>

                            <td>
                                {
                                    clase?.nombre ??
                                    `Clase #${horario.claseId}`
                                }
                            </td>

                            <td>
                                {
                                    instructor?.nombre ??
                                    `Instructor #${horario.instructorId}`
                                }
                            </td>

                            <td>
                                {horario.fecha}
                            </td>

                            <td>
                                {horario.horaInicio}
                            </td>

                            <td>
                                {horario.horaFin}
                            </td>

                            {puedeEditar && (

                                <td>

                                    <Button
                                        type="button"
                                        variant="ghost"
                                        disabled={
                                            cargandoDetalle
                                        }
                                        onClick={() =>
                                            onEditar(
                                                horario.id
                                            )
                                        }
                                    >
                                        Editar
                                    </Button>

                                </td>

                            )}

                        </tr>
                    );
                })}

                </tbody>

            </table>

        </div>
    );
}