import {
    useMemo
} from "react";

import type {
    NotificacionApi,
    SocioApi
} from "../models/ApiModels";

import {
    Button
} from "./ui/Button";

import {
    StatusBadge
} from "./ui/StatusBadge";

interface NotificacionTableProps {
    notificaciones:
        NotificacionApi[];

    socios:
        SocioApi[];

    mostrarSocio:
        boolean;

    procesandoId:
        number | null;

    onMarcarLeida:
        (notificacion: NotificacionApi) => void;
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

export default function NotificacionTable({
                                              notificaciones,
                                              socios,
                                              mostrarSocio,
                                              procesandoId,
                                              onMarcarLeida
                                          }: NotificacionTableProps) {

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
                        <th>
                            Socio
                        </th>
                    )}

                    <th>
                        Título
                    </th>

                    <th>
                        Mensaje
                    </th>

                    <th>
                        Fecha
                    </th>

                    <th>
                        Estado
                    </th>

                    <th>
                        Acciones
                    </th>

                </tr>

                </thead>

                <tbody>

                {notificaciones.map(
                    (notificacion) => {

                        const socio =
                            sociosPorId.get(
                                notificacion.socioId
                            );

                        return (
                            <tr
                                key={
                                    notificacion.id
                                }
                            >

                                <td>
                                    {
                                        notificacion.id
                                    }
                                </td>

                                {mostrarSocio && (

                                    <td>
                                        {
                                            socio?.nombre ??
                                            `Socio #${notificacion.socioId}`
                                        }
                                    </td>

                                )}

                                <td>
                                    {
                                        notificacion.titulo
                                    }
                                </td>

                                <td className="notificaciones-message-cell">
                                    {
                                        notificacion.mensaje
                                    }
                                </td>

                                <td>
                                    {
                                        fechaHora(
                                            notificacion.fechaEnvio
                                        )
                                    }
                                </td>

                                <td>

                                    <StatusBadge
                                        label={
                                            notificacion.leida
                                                ? "LEÍDA"
                                                : "NO LEÍDA"
                                        }
                                        tone={
                                            notificacion.leida
                                                ? "neutral"
                                                : "info"
                                        }
                                    />

                                </td>

                                <td>

                                    {notificacion.leida ? (

                                        "Sin acciones"

                                    ) : (

                                        <Button
                                            type="button"
                                            variant="ghost"
                                            disabled={
                                                procesandoId !==
                                                null
                                            }
                                            loading={
                                                procesandoId ===
                                                notificacion.id
                                            }
                                            onClick={() =>
                                                onMarcarLeida(
                                                    notificacion
                                                )
                                            }
                                        >
                                            Marcar como leída
                                        </Button>

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