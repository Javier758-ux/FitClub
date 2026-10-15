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

import MembresiaForm
    from "./MembresiaForm";

const socios = [
    {
        id: 8,
        nombre: "Luis Socio",
        email: "luis@fitclub.com",
        telefono: "70000008",
        fechaRegistro: "2026-10-01"
    }
];

const planes = [
    {
        id: 4,
        nombre: "Mensual",
        descripcion:
            "Plan mensual",
        precio: 200,
        duracionDias: 30
    }
];

describe(
    "MembresiaForm",
    () => {

        it(
            "valida que todos los campos sean obligatorios",
            async () => {

                const user =
                    userEvent.setup();

                const onGuardar =
                    vi.fn(
                        async () => {}
                    );

                render(
                    <MembresiaForm
                        socios={
                            socios
                        }
                        planes={
                            planes
                        }
                        onGuardar={
                            onGuardar
                        }
                    />
                );

                await user.click(
                    screen.getByRole(
                        "button",
                        {
                            name:
                                /guardar membresía/i
                        }
                    )
                );

                expect(
                    screen.getByRole(
                        "alert"
                    )
                ).toHaveTextContent(
                    "Todos los campos son obligatorios."
                );

                expect(
                    onGuardar
                ).not.toHaveBeenCalled();
            }
        );

        it(
            "envía socio, plan y fecha de inicio cuando los datos son válidos",
            async () => {

                const user =
                    userEvent.setup();

                const onGuardar =
                    vi.fn(
                        async () => {}
                    );

                render(
                    <MembresiaForm
                        socios={
                            socios
                        }
                        planes={
                            planes
                        }
                        onGuardar={
                            onGuardar
                        }
                    />
                );

                await user.selectOptions(
                    screen.getByLabelText(
                        /socio/i
                    ),
                    "8"
                );

                await user.selectOptions(
                    screen.getByLabelText(
                        /plan/i
                    ),
                    "4"
                );

                await user.type(
                    screen.getByLabelText(
                        /fecha de inicio/i
                    ),
                    "2026-10-15"
                );

                await user.click(
                    screen.getByRole(
                        "button",
                        {
                            name:
                                /guardar membresía/i
                        }
                    )
                );

                expect(
                    onGuardar
                ).toHaveBeenCalledWith({
                    socioId: 8,
                    planId: 4,
                    fechaInicio:
                        "2026-10-15"
                });
            }
        );
    }
);