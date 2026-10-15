import {
    useState
} from "react";

import {
    render,
    screen
} from "@testing-library/react";

import userEvent
    from "@testing-library/user-event";

import {
    describe,
    expect,
    it
} from "vitest";

import {
    SearchInput
} from "./SearchInput";

function SearchTest() {

    const [
        value,
        setValue
    ] = useState("");

    return (
        <SearchInput
            label="Buscar socio"
            value={value}
            onChange={setValue}
        />
    );
}

describe(
    "SearchInput",
    () => {

        it(
            "actualiza el texto escrito por el usuario",
            async () => {

                const user =
                    userEvent.setup();

                render(
                    <SearchTest />
                );

                const input =
                    screen.getByRole(
                        "searchbox"
                    );

                await user.type(
                    input,
                    "javier"
                );

                expect(
                    input
                ).toHaveValue(
                    "javier"
                );
            }
        );

    }
);