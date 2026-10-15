import {
    useMemo
} from "react";

import type {
    AsistenciaApi,
    ClaseApi,
    HorarioApi,
    ReservaApi,
    SocioApi
} from "../models/ApiModels";

import {
    StatusBadge
} from "./ui/StatusBadge";

interface AsistenciaTableProps {
    asistencias: AsistenciaApi[];
    reservas: ReservaApi[];
    socios: SocioApi[];
    horarios: HorarioApi[];
    clases: ClaseApi[];
}

function fechaHora(
    valor: string
): string {

    return valor
        .replace(
            "T",
            " "
        )
        .slice(
            0,
            16
        );
}

export default function AsistenciaTable({
                                            asistencias,
                                            reservas,
                                            socios,
                                            horarios,
                                            clases
                                        }: AsistenciaTableProps) {

    const reservasPorId =
        useMemo(
            () =>
                new Map(
                    reservas.map(
                        (reserva) => [
                            reserva.id,
                            reserva
                        ]
                    )
                ),
            [reservas]
        );

    const sociosPorId =
        useMemo(
            () =>
                new Map(
                    socios.map(
                        (socio) => [
                            socio.id,
                            socio
                        ]
                    )
                ),
            [socios]
        );

    const horariosPorId =
        useMemo(
            () =>
                new Map(
                    horarios.map(
                        (horario) => [
                            horario.id,
                            horario
                        ]
                    )
                ),
            [horarios]
        );

    const clasesPorId =
        useMemo(
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

    return (
        <div className="table-wrapper">

            <table className="fitclub-table">

                <thead>

                <tr>
                    <th>ID</th>
                    <th>Socio</th>
                    <th>Clase</th>
                    <th>Fecha clase</th>
                    <th>Registro</th>
                    <th>Resultado</th>
                </tr>

                </thead>

                <tbody>

                {asistencias.map(
                    (asistencia) => {

                        const reserva =
                            reservasPorId.get(
                                asistencia.reservaClaseId
                            );

                        const socio =
                            reserva
                                ? sociosPorId.get(
                                    reserva.socioId
                                )
                                : undefined;

                        const horario =
                            reserva
                                ? horariosPorId.get(
                                    reserva.horarioClaseId
                                )
                                : undefined;

                        const clase =
                            horario
                                ? clasesPorId.get(
                                    horario.claseId
                                )
                                : undefined;

                        return (
                            <tr
                                key={
                                    asistencia.id
                                }
                            >

                                <td>
                                    {
                                        asistencia.id
                                    }
                                </td>

                                <td>
                                    {
                                        socio?.nombre ??
                                        (
                                            reserva
                                                ? `Socio #${reserva.socioId}`
                                                : "Reserva no encontrada"
                                        )
                                    }
                                </td>

                                <td>
                                    {
                                        clase?.nombre ??
                                        "—"
                                    }
                                </td>

                                <td>
                                    {
                                        horario?.fecha ??
                                        "—"
                                    }
                                </td>

                                <td>
                                    {
                                        fechaHora(
                                            asistencia.fechaRegistro
                                        )
                                    }
                                </td>

                                <td>

                                    <StatusBadge
                                        label={
                                            asistencia.presente
                                                ? "PRESENTE"
                                                : "AUSENTE"
                                        }
                                        tone={
                                            asistencia.presente
                                                ? "success"
                                                : "warning"
                                        }
                                    />

                                </td>

                            </tr>
                        );
                    }
                )}

                </tbody>

            </table>

        </div>
    );
}