import { useMemo } from "react";

import type {
    SocioApi
} from "../models/ApiModels";

import type {
    Plan
} from "../models/Plan";

import type {
    Membresia
} from "../models/Membresia";

import {
    StatusBadge
} from "./ui/StatusBadge";

import type {
    StatusTone
} from "./ui/StatusBadge";

import {
    Button
} from "./ui/Button";

interface MembresiaTableProps {
    membresias: Membresia[];
    socios: SocioApi[];
    planes: Plan[];

    procesandoId:
        number | null;

    onSuspender:
        (membresia: Membresia) => void;

    onReactivar:
        (membresia: Membresia) => void;

    onCancelar:
        (membresia: Membresia) => void;
}

function obtenerTone(
    estado: Membresia["estado"]
): StatusTone {

    if (
        estado === "ACTIVA"
    ) {
        return "success";
    }

    if (
        estado === "SUSPENDIDA"
    ) {
        return "warning";
    }

    if (
        estado === "CANCELADA"
    ) {
        return "danger";
    }

    return "neutral";
}

export default function MembresiaTable({
                                           membresias,
                                           socios,
                                           planes,
                                           procesandoId,
                                           onSuspender,
                                           onReactivar,
                                           onCancelar
                                       }: MembresiaTableProps) {

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

    const procesando =
        procesandoId !== null;

    return (
        <div className="table-wrapper">

            <table className="fitclub-table">

                <thead>
                <tr>
                    <th>ID</th>
                    <th>Socio</th>
                    <th>Plan</th>
                    <th>Inicio</th>
                    <th>Fin</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                </tr>
                </thead>

                <tbody>

                {membresias.map(
                    (membresia) => {

                        const socio =
                            sociosPorId.get(
                                membresia.socioId
                            );

                        const plan =
                            planesPorId.get(
                                membresia.planId
                            );

                        return (
                            <tr
                                key={
                                    membresia.id
                                }
                            >

                                <td>
                                    {
                                        membresia.id
                                    }
                                </td>

                                <td>
                                    {
                                        socio?.nombre ??
                                        `Socio #${membresia.socioId}`
                                    }
                                </td>

                                <td>
                                    {
                                        plan?.nombre ??
                                        `Plan #${membresia.planId}`
                                    }
                                </td>

                                <td>
                                    {
                                        membresia.fechaInicio
                                    }
                                </td>

                                <td>
                                    {
                                        membresia.fechaFin
                                    }
                                </td>

                                <td>
                                    <StatusBadge
                                        label={
                                            membresia.estado
                                        }
                                        tone={
                                            obtenerTone(
                                                membresia.estado
                                            )
                                        }
                                    />
                                </td>

                                <td>

                                    <div className="module-toolbar__actions">

                                        {
                                            membresia.estado ===
                                            "ACTIVA" && (
                                                <Button
                                                    type="button"
                                                    variant="secondary"
                                                    disabled={
                                                        procesando
                                                    }
                                                    onClick={() =>
                                                        onSuspender(
                                                            membresia
                                                        )
                                                    }
                                                >
                                                    Suspender
                                                </Button>
                                            )
                                        }

                                        {
                                            membresia.estado ===
                                            "SUSPENDIDA" && (
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    disabled={
                                                        procesando
                                                    }
                                                    onClick={() =>
                                                        onReactivar(
                                                            membresia
                                                        )
                                                    }
                                                >
                                                    Reactivar
                                                </Button>
                                            )
                                        }

                                        {
                                            (
                                                membresia.estado ===
                                                "ACTIVA" ||
                                                membresia.estado ===
                                                "SUSPENDIDA"
                                            ) && (
                                                <Button
                                                    type="button"
                                                    variant="danger"
                                                    disabled={
                                                        procesando
                                                    }
                                                    onClick={() =>
                                                        onCancelar(
                                                            membresia
                                                        )
                                                    }
                                                >
                                                    Cancelar
                                                </Button>
                                            )
                                        }

                                    </div>

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