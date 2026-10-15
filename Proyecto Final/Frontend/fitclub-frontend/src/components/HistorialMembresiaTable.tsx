import {
    useMemo
} from "react";

import type {
    HistorialMembresiaApi,
    SocioApi
} from "../models/ApiModels";

import type {
    Membresia
} from "../models/Membresia";

import type {
    Plan
} from "../models/Plan";

import {
    StatusBadge
} from "./ui/StatusBadge";

import type {
    StatusTone
} from "./ui/StatusBadge";

interface HistorialMembresiaTableProps {

    historial:
        HistorialMembresiaApi[];

    membresias:
        Membresia[];

    socios:
        SocioApi[];

    planes:
        Plan[];
}

function obtenerTone(
    estado:
    HistorialMembresiaApi[
        "estadoNuevo"
        ]
): StatusTone {

    if (
        estado ===
        "ACTIVA"
    ) {
        return "success";
    }

    if (
        estado ===
        "SUSPENDIDA"
    ) {
        return "warning";
    }

    if (
        estado ===
        "CANCELADA"
    ) {
        return "danger";
    }

    return "neutral";
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

export default function HistorialMembresiaTable({
                                                    historial,
                                                    membresias,
                                                    socios,
                                                    planes
                                                }: HistorialMembresiaTableProps) {

    const membresiasPorId =
        useMemo(
            () =>
                new Map(
                    membresias.map(
                        (membresia) => [
                            membresia.id,
                            membresia
                        ]
                    )
                ),
            [membresias]
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

    const planesPorId =
        useMemo(
            () =>
                new Map(
                    planes.map(
                        (plan) => [
                            plan.id,
                            plan
                        ]
                    )
                ),
            [planes]
        );

    return (
        <div className="table-wrapper">

            <table className="fitclub-table">

                <thead>

                <tr>

                    <th>
                        ID
                    </th>

                    <th>
                        Membresía
                    </th>

                    <th>
                        Socio
                    </th>

                    <th>
                        Plan
                    </th>

                    <th>
                        Cambio
                    </th>

                    <th>
                        Motivo
                    </th>

                    <th>
                        Usuario
                    </th>

                    <th>
                        Fecha
                    </th>

                </tr>

                </thead>

                <tbody>

                {historial.map(
                    (registro) => {

                        const membresia =
                            membresiasPorId.get(
                                registro.membresiaId
                            );

                        const socio =
                            membresia
                                ? sociosPorId.get(
                                    membresia.socioId
                                )
                                : undefined;

                        const plan =
                            membresia
                                ? planesPorId.get(
                                    membresia.planId
                                )
                                : undefined;

                        return (
                            <tr
                                key={
                                    registro.id
                                }
                            >

                                <td>
                                    {registro.id}
                                </td>

                                <td>
                                    #
                                    {
                                        registro.membresiaId
                                    }
                                </td>

                                <td>

                                    {
                                        socio?.nombre ??
                                        (
                                            membresia
                                                ? `Socio #${membresia.socioId}`
                                                : "—"
                                        )
                                    }

                                </td>

                                <td>

                                    {
                                        plan?.nombre ??
                                        (
                                            membresia
                                                ? `Plan #${membresia.planId}`
                                                : "—"
                                        )
                                    }

                                </td>

                                <td>

                                    <div className="membership-history-change">

                                            <span>

                                                {
                                                    registro.estadoAnterior ??
                                                    "CREADA"
                                                }

                                            </span>

                                        <span>
                                                →
                                            </span>

                                        <StatusBadge
                                            label={
                                                registro.estadoNuevo
                                            }
                                            tone={
                                                obtenerTone(
                                                    registro.estadoNuevo
                                                )
                                            }
                                        />

                                    </div>

                                </td>

                                <td>

                                    {
                                        registro.motivo ||
                                        "—"
                                    }

                                </td>

                                <td>

                                    {
                                        registro.usuarioEmail ||
                                        "—"
                                    }

                                </td>

                                <td>

                                    {
                                        fechaHora(
                                            registro.fechaCambio
                                        )
                                    }

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