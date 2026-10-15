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

import ReservaForm
    from "./ReservaForm";

const socios = [
    {
        id: 1,
        nombre: "Ana Socia",
        email: "ana@fitclub.com",
        telefono: "70000001",
        fechaRegistro: "2026-10-01"
    }
];

const clases = [
    {
        id: 3,
        nombre: "Spinning",
        descripcion: "Clase de bicicleta",
        cupoMaximo: 20
    }
];

const horarios = [
    {
        id: 10,
        claseId: 3,
        instructorId: 7,
        fecha: "2099-10-20",
        horaInicio: "18:00:00",
        horaFin: "19:00:00"
    }
];

describe(
    "ReservaForm",
    () => {

        it(
            "no guarda si no se selecciona un horario futuro",
            async () => {

                const user =
                    userEvent.setup();

                const onGuardar =
                    vi.fn(
                        async () => {}
                    );

                render(
                    <ReservaForm
                        modo="PROPIA"
                        socios={[]}
                        horarios={horarios}
                        clases={clases}
                        onGuardar={onGuardar}
                        onCancelar={vi.fn()}
                    />
                );

                await user.click(
                    screen.getByRole(
                        "button",
                        {
                            name:
                                /guardar reserva/i
                        }
                    )
                );

                expect(
                    screen.getByRole(
                        "alert"
                    )
                ).toHaveTextContent(
                    "Selecciona un horario futuro válido."
                );

                expect(
                    onGuardar
                ).not.toHaveBeenCalled();
            }
        );

        it(
            "envía horario y socio en una reserva administrativa válida",
            async () => {

                const user =
                    userEvent.setup();

                const onGuardar =
                    vi.fn(
                        async () => {}
                    );

                render(
                    <ReservaForm
                        modo="ADMINISTRATIVA"
                        socios={socios}
                        horarios={horarios}
                        clases={clases}
                        onGuardar={onGuardar}
                        onCancelar={vi.fn()}
                    />
                );

                await user.selectOptions(
                    screen.getByLabelText(
                        /socio/i
                    ),
                    "1"
                );

                await user.selectOptions(
                    screen.getByLabelText(
                        /clase y horario/i
                    ),
                    "10"
                );

                await user.click(
                    screen.getByRole(
                        "button",
                        {
                            name:
                                /guardar reserva/i
                        }
                    )
                );

                expect(
                    onGuardar
                ).toHaveBeenCalledWith(
                    10,
                    1
                );
            }
        );
    }
);