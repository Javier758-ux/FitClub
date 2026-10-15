import { useMemo } from "react";

import type {
    ClaseApi,
    HorarioApi,
    InstructorApi
} from "../models/ApiModels";

import {
    Button
} from "./ui/Button";

interface InstructorCalendarProps {
    horarios: HorarioApi[];
    clases: ClaseApi[];
    instructores: InstructorApi[];

    puedeEditar: boolean;

    cargandoDetalle: boolean;

    onEditar:
        (id: number) => void;
}

function etiquetaFecha(
    fecha: string
): string {

    const valor =
        new Date(
            `${fecha}T00:00:00`
        );

    return new Intl.DateTimeFormat(
        "es-BO",
        {
            weekday: "long",
            day: "2-digit",
            month: "long",
            year: "numeric"
        }
    ).format(
        valor
    );
}

export default function InstructorCalendar({
                                               horarios,
                                               clases,
                                               instructores,
                                               puedeEditar,
                                               cargandoDetalle,
                                               onEditar
                                           }: InstructorCalendarProps) {

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

    const instructoresPorId =
        useMemo(
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

    const grupos =
        useMemo(() => {

            const mapa =
                new Map<
                    string,
                    HorarioApi[]
                >();

            [...horarios]
                .sort(
                    (a, b) => {

                        const fecha =
                            a.fecha.localeCompare(
                                b.fecha
                            );

                        return fecha !== 0
                            ? fecha
                            : a.horaInicio.localeCompare(
                                b.horaInicio
                            );
                    }
                )
                .forEach(
                    (horario) => {

                        const lista =
                            mapa.get(
                                horario.fecha
                            ) ?? [];

                        lista.push(
                            horario
                        );

                        mapa.set(
                            horario.fecha,
                            lista
                        );
                    }
                );

            return Array.from(
                mapa.entries()
            ).map(
                ([
                     fecha,
                     lista
                 ]) => ({
                    fecha,
                    horarios: lista
                })
            );

        }, [
            horarios
        ]);

    return (
        <div className="instructor-calendar">

            {grupos.map(
                (grupo) => (

                    <section
                        key={
                            grupo.fecha
                        }
                        className="instructor-calendar__day"
                    >

                        <header className="instructor-calendar__day-header">

                            <div>

                                <span className="instructor-calendar__date-value">
                                    {grupo.fecha}
                                </span>

                                <h2>
                                    {
                                        etiquetaFecha(
                                            grupo.fecha
                                        )
                                    }
                                </h2>

                            </div>

                            <span className="instructor-calendar__count">

                                {
                                    grupo.horarios.length
                                }

                                {" "}

                                {
                                    grupo.horarios.length ===
                                    1
                                        ? "clase"
                                        : "clases"
                                }

                            </span>

                        </header>

                        <div className="instructor-calendar__events">

                            {grupo.horarios.map(
                                (horario) => {

                                    const clase =
                                        clasesPorId.get(
                                            horario.claseId
                                        );

                                    const instructor =
                                        instructoresPorId.get(
                                            horario.instructorId
                                        );

                                    return (
                                        <article
                                            key={
                                                horario.id
                                            }
                                            className="instructor-calendar__event"
                                        >

                                            <div className="instructor-calendar__time">

                                                <strong>
                                                    {
                                                        horario.horaInicio.slice(
                                                            0,
                                                            5
                                                        )
                                                    }
                                                </strong>

                                                <span>
                                                    a
                                                </span>

                                                <strong>
                                                    {
                                                        horario.horaFin.slice(
                                                            0,
                                                            5
                                                        )
                                                    }
                                                </strong>

                                            </div>

                                            <div className="instructor-calendar__event-info">

                                                <h3>

                                                    {
                                                        clase?.nombre ??
                                                        `Clase #${horario.claseId}`
                                                    }

                                                </h3>

                                                <p>

                                                    Instructor:{" "}

                                                    <strong>

                                                        {
                                                            instructor?.nombre ??
                                                            `Instructor #${horario.instructorId}`
                                                        }

                                                    </strong>

                                                </p>

                                                {
                                                    instructor?.especialidad && (

                                                        <span>
                                                            {
                                                                instructor.especialidad
                                                            }
                                                        </span>

                                                    )
                                                }

                                            </div>

                                            {puedeEditar && (

                                                <div className="instructor-calendar__event-actions">

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

                                                </div>

                                            )}

                                        </article>
                                    );
                                }
                            )}

                        </div>

                    </section>
                )
            )}

        </div>
    );
}