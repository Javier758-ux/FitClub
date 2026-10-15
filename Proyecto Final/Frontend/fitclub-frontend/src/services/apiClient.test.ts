import {
    afterEach,
    beforeEach,
    describe,
    expect,
    it,
    vi
} from "vitest";

import {
    AUTH_TOKEN_KEY,
    AUTH_UNAUTHORIZED_EVENT
} from "../auth/authStorage";

import {
    ApiError,
    apiClient
} from "./apiClient";

describe(
    "apiClient",
    () => {

        beforeEach(() => {

            sessionStorage.clear();

            vi.restoreAllMocks();
        });

        afterEach(() => {

            vi.unstubAllGlobals();
        });

        it(
            "envía el JWT en el header Authorization",
            async () => {

                sessionStorage.setItem(
                    AUTH_TOKEN_KEY,
                    "token-prueba"
                );

                let opcionesCapturadas:
                    RequestInit | undefined;

                const fetchMock =
                    vi.fn(
                        async (
                            _input: RequestInfo | URL,
                            opciones?: RequestInit
                        ) => {

                            opcionesCapturadas =
                                opciones;

                            return new Response(
                                JSON.stringify({
                                    ok: true
                                }),
                                {
                                    status: 200,
                                    headers: {
                                        "Content-Type":
                                            "application/json"
                                    }
                                }
                            );
                        }
                    );

                vi.stubGlobal(
                    "fetch",
                    fetchMock
                );

                await apiClient.get<{
                    ok: boolean;
                }>(
                    "/prueba"
                );

                expect(
                    fetchMock
                ).toHaveBeenCalledTimes(
                    1
                );

                expect(
                    opcionesCapturadas
                ).toBeDefined();

                const headers =
                    new Headers(
                        opcionesCapturadas?.headers
                    );

                expect(
                    headers.get(
                        "Authorization"
                    )
                ).toBe(
                    "Bearer token-prueba"
                );
            }
        );

        it(
            "elimina el token y notifica la sesión vencida cuando recibe 401",
            async () => {

                sessionStorage.setItem(
                    AUTH_TOKEN_KEY,
                    "token-vencido"
                );

                const listener =
                    vi.fn();

                window.addEventListener(
                    AUTH_UNAUTHORIZED_EVENT,
                    listener
                );

                const fetchMock =
                    vi.fn(
                        async () =>
                            new Response(
                                "",
                                {
                                    status: 401
                                }
                            )
                    );

                vi.stubGlobal(
                    "fetch",
                    fetchMock
                );

                await expect(
                    apiClient.get(
                        "/privado"
                    )
                ).rejects.toMatchObject({
                    name: "ApiError",
                    status: 401
                } satisfies Partial<ApiError>);

                expect(
                    sessionStorage.getItem(
                        AUTH_TOKEN_KEY
                    )
                ).toBeNull();

                expect(
                    listener
                ).toHaveBeenCalledTimes(
                    1
                );

                window.removeEventListener(
                    AUTH_UNAUTHORIZED_EVENT,
                    listener
                );
            }
        );
    }
);