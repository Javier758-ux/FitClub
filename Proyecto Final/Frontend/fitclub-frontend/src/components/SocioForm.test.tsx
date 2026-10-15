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

import SocioForm
    from "./SocioForm";

describe(
    "SocioForm",
    () => {

        it(
            "no guarda cuando el nombre está vacío",
            async () => {

                const user =
                    userEvent.setup();

                const onGuardar =
                    vi.fn(
                        async () => {}
                    );

                const onCancelar =
                    vi.fn();

                render(
                    <SocioForm
                        socioEditar={null}
                        onGuardar={
                            onGuardar
                        }
                        onCancelar={
                            onCancelar
                        }
                    />
                );

                await user.click(
                    screen.getByRole(
                        "button",
                        {
                            name:
                                /registrar socio/i
                        }
                    )
                );

                expect(
                    screen.getByRole(
                        "alert"
                    )
                ).toHaveTextContent(
                    "El nombre es obligatorio."
                );

                expect(
                    onGuardar
                ).not.toHaveBeenCalled();
            }
        );

    }
);