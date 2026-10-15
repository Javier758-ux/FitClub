import {
    render,
    screen
} from "@testing-library/react";

import userEvent
    from "@testing-library/user-event";

import {
    describe,
    expect,
    it,
    vi
} from "vitest";

import AsistenciaForm
    from "./AsistenciaForm";

const socios = [
    {
        id: 1,
        nombre: "Ana Socia",
        email: "ana@fitclub.com",
        telefono: "70000001",
        fechaRegistro: "2026-10-01"
    }
];

const horarios = [
    {
        id: 20,
        claseId: 5,
        instructorId: 2,
        fecha: "2026-10-15",
        horaInicio: "10:00:00",
        horaFin: "11:00:00"
    }
];

const clases = [
    {
        id: 5,
        nombre: "Funcional",
        descripcion:
            "Entrenamiento funcional",
        cupoMaximo: 15
    }
];

const reservas = [
    {
        id: 100,
        socioId: 1,
        horarioClaseId: 20,
        fechaReserva:
            "2026-10-10T10:00:00",
        estado:
            "ACTIVA" as const,
        fechaCancelacion: null,
        cancelacionTardia: false
    },
    {
        id: 101,
        socioId: 1,
        horarioClaseId: 20,
        fechaReserva:
            "2026-10-10T11:00:00",
        estado:
            "CANCELADA" as const,
        fechaCancelacion:
            "2026-10-11T10:00:00",
        cancelacionTardia: false
    }
];

describe(
    "AsistenciaForm",
    () => {

        it(
            "solo ofrece reservas activas que todavía no tienen asistencia",
            () => {

                render(
                    <AsistenciaForm
                        reservas={
                            reservas
                        }
                        asistencias={[
                            {
                                id: 50,
                                reservaClaseId:
                                    100,
                                fechaRegistro:
                                    "2026-10-15T10:30:00",
                                presente: true
                            }
                        ]}
                        socios={
                            socios
                        }
                        horarios={
                            horarios
                        }
                        clases={
                            clases
                        }
                        onGuardar={
                            vi.fn()
                        }
                        onCancelar={
                            vi.fn()
                        }
                    />
                );

                expect(
                    screen.getByText(
                        /no existen reservas activas pendientes de asistencia/i
                    )
                ).toBeInTheDocument();

                expect(
                    screen.getByRole(
                        "button",
                        {
                            name:
                                /guardar asistencia/i
                        }
                    )
                ).toBeDisabled();
            }
        );

        it(
            "registra presente sobre una reserva activa válida",
            async () => {

                const user =
                    userEvent.setup();

                const onGuardar =
                    vi.fn(
                        async () => {}
                    );

                render(
                    <AsistenciaForm
                        reservas={
                            reservas
                        }
                        asistencias={[]}
                        socios={
                            socios
                        }
                        horarios={
                            horarios
                        }
                        clases={
                            clases
                        }
                        onGuardar={
                            onGuardar
                        }
                        onCancelar={
                            vi.fn()
                        }
                    />
                );

                await user.selectOptions(
                    screen.getByLabelText(
                        /reserva/i
                    ),
                    "100"
                );

                await user.selectOptions(
                    screen.getByLabelText(
                        /resultado/i
                    ),
                    "true"
                );

                await user.click(
                    screen.getByRole(
                        "button",
                        {
                            name:
                                /guardar asistencia/i
                        }
                    )
                );

                expect(
                    onGuardar
                ).toHaveBeenCalledWith({
                    reservaClaseId: 100,
                    presente: true
                });
            }
        );
    }
);