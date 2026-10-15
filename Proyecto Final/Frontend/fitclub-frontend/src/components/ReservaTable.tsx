import {
    useMemo
} from "react";

import type {
    ClaseApi,
    HorarioApi,
    ReservaApi,
    SocioApi
} from "../models/ApiModels";

import {
    Button
} from "./ui/Button";

import {
    StatusBadge
} from "./ui/StatusBadge";

interface ReservaTableProps {
    reservas: ReservaApi[];
    horarios: HorarioApi[];
    clases: ClaseApi[];
    socios: SocioApi[];

    mostrarSocio: boolean;

    procesandoId:
        number | null;

    onCancelar:
        (reserva: ReservaApi) => void;
}

function fechaHora(
    valor: string | null
): string {

    if (!valor) {
        return "—";
    }

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

export default function ReservaTable({
                                         reservas,
                                         horarios,
                                         clases,
                                         socios,
                                         mostrarSocio,
                                         procesandoId,
                                         onCancelar
                                     }: ReservaTableProps) {

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

    return (
        <div className="table-wrapper">

            <table className="fitclub-table">

                <thead>

                <tr>

                    <th>ID</th>

                    {mostrarSocio && (
                        <th>Socio</th>
                    )}

                    <th>Clase</th>
                    <th>Fecha</th>
                    <th>Horario</th>
                    <th>Reservada</th>
                    <th>Estado</th>
                    <th>
                        Cancelación tardía
                    </th>
                    <th>Acciones</th>

                </tr>

                </thead>

                <tbody>

                {reservas.map(
                    (reserva) => {

                        const horario =
                            horariosPorId.get(
                                reserva.horarioClaseId
                            );

                        const clase =
                            horario
                                ? clasesPorId.get(
                                    horario.claseId
                                )
                                : undefined;

                        const socio =
                            sociosPorId.get(
                                reserva.socioId
                            );

                        return (
                            <tr
                                key={
                                    reserva.id
                                }
                            >

                                <td>
                                    {reserva.id}
                                </td>

                                {mostrarSocio && (

                                    <td>
                                        {
                                            socio?.nombre ??
                                            `Socio #${reserva.socioId}`
                                        }
                                    </td>

                                )}

                                <td>
                                    {
                                        clase?.nombre ??
                                        "Clase no encontrada"
                                    }
                                </td>

                                <td>
                                    {
                                        horario?.fecha ??
                                        "—"
                                    }
                                </td>

                                <td>
                                    {horario
                                        ? `${horario.horaInicio.slice(0, 5)} - ${horario.horaFin.slice(0, 5)}`
                                        : "—"}
                                </td>

                                <td>
                                    {
                                        fechaHora(
                                            reserva.fechaReserva
                                        )
                                    }
                                </td>

                                <td>

                                    <StatusBadge
                                        label={
                                            reserva.estado
                                        }
                                        tone={
                                            reserva.estado ===
                                            "ACTIVA"
                                                ? "success"
                                                : "danger"
                                        }
                                    />

                                </td>

                                <td>

                                    {reserva.estado ===
                                    "CANCELADA" ? (

                                        <StatusBadge
                                            label={
                                                reserva.cancelacionTardia
                                                    ? "Sí"
                                                    : "No"
                                            }
                                            tone={
                                                reserva.cancelacionTardia
                                                    ? "warning"
                                                    : "neutral"
                                            }
                                        />

                                    ) : (

                                        "—"

                                    )}

                                </td>

                                <td>

                                    {reserva.estado ===
                                    "ACTIVA" ? (

                                        <Button
                                            type="button"
                                            variant="danger"
                                            disabled={
                                                procesandoId !==
                                                null
                                            }
                                            onClick={() =>
                                                onCancelar(
                                                    reserva
                                                )
                                            }
                                        >

                                            {procesandoId ===
                                            reserva.id
                                                ? "Cancelando..."
                                                : "Cancelar"}

                                        </Button>

                                    ) : (

                                        "Sin acciones"

                                    )}

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