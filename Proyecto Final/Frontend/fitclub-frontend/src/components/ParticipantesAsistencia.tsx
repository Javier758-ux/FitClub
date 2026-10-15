import type {
    AsistenciaApi,
    ReservaApi
} from "../models/ApiModels";

import {
    Button
} from "./ui/Button";

import {
    StatusBadge
} from "./ui/StatusBadge";

interface ParticipantesAsistenciaProps {
    participantes: ReservaApi[];

    registrosLocales:
        Map<number, AsistenciaApi>;

    procesandoReservaId:
        number | null;

    onRegistrar: (
        reserva: ReservaApi,
        presente: boolean
    ) => void;
}

export default function ParticipantesAsistencia({
                                                    participantes,
                                                    registrosLocales,
                                                    procesandoReservaId,
                                                    onRegistrar
                                                }: ParticipantesAsistenciaProps) {

    return (
        <div className="table-wrapper">

            <table className="fitclub-table">

                <thead>

                <tr>
                    <th>Reserva</th>
                    <th>Socio</th>
                    <th>Estado reserva</th>
                    <th>Asistencia</th>
                    <th>Acciones</th>
                </tr>

                </thead>

                <tbody>

                {participantes.map(
                    (reserva) => {

                        const asistencia =
                            registrosLocales.get(
                                reserva.id
                            );

                        const procesando =
                            procesandoReservaId ===
                            reserva.id;

                        return (
                            <tr
                                key={
                                    reserva.id
                                }
                            >

                                <td>
                                    {reserva.id}
                                </td>

                                <td>
                                    Socio #{reserva.socioId}
                                </td>

                                <td>

                                    <StatusBadge
                                        label={
                                            reserva.estado
                                        }
                                        tone="success"
                                    />

                                </td>

                                <td>

                                    {asistencia ? (

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

                                    ) : (

                                        "Pendiente"

                                    )}

                                </td>

                                <td>

                                    {asistencia ? (

                                        "Registrada"

                                    ) : (

                                        <div className="asistencias-row-actions">

                                            <Button
                                                type="button"
                                                variant="ghost"
                                                disabled={
                                                    procesandoReservaId !==
                                                    null
                                                }
                                                loading={
                                                    procesando
                                                }
                                                onClick={() =>
                                                    onRegistrar(
                                                        reserva,
                                                        true
                                                    )
                                                }
                                            >
                                                Presente
                                            </Button>

                                            <Button
                                                type="button"
                                                variant="secondary"
                                                disabled={
                                                    procesandoReservaId !==
                                                    null
                                                }
                                                onClick={() =>
                                                    onRegistrar(
                                                        reserva,
                                                        false
                                                    )
                                                }
                                            >
                                                Ausente
                                            </Button>

                                        </div>

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