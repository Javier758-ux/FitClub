import {
    render,
    screen
} from "@testing-library/react";

import {
    describe,
    expect,
    it
} from "vitest";

import {
    MetricCard
} from "./MetricCard";

describe(
    "MetricCard",
    () => {

        it(
            "muestra la etiqueta y el valor",
            () => {

                render(
                    <MetricCard
                        label="Clases"
                        value={12}
                        helper="Clases disponibles"
                    />
                );

                expect(
                    screen.getByText(
                        "Clases"
                    )
                ).toBeInTheDocument();

                expect(
                    screen.getByText(
                        "12"
                    )
                ).toBeInTheDocument();

                expect(
                    screen.getByText(
                        "Clases disponibles"
                    )
                ).toBeInTheDocument();
            }
        );

    }
);