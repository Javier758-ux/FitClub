import {
    render,
    screen
} from "@testing-library/react";

import {
    MemoryRouter,
    Route,
    Routes
} from "react-router-dom";

import {
    beforeEach,
    describe,
    expect,
    it,
    vi
} from "vitest";

import ProtectedRoute
    from "./ProtectedRoute";

import {
    useAuth
} from "./AuthContext";

vi.mock(
    "./AuthContext",
    () => ({
        useAuth: vi.fn()
    })
);

const mockedUseAuth =
    vi.mocked(
        useAuth
    );

function renderProtegida(
    roles?: readonly (
        | "ADMINISTRADOR"
        | "RECEPCION"
        | "INSTRUCTOR"
        | "SOCIO"
        )[]
) {

    render(
        <MemoryRouter
            initialEntries={[
                "/privada"
            ]}
        >

            <Routes>

                <Route
                    path="/login"
                    element={
                        <h1>
                            Login
                        </h1>
                    }
                />

                <Route
                    path="/sin-permiso"
                    element={
                        <h1>
                            Sin permiso
                        </h1>
                    }
                />

                <Route
                    element={
                        <ProtectedRoute
                            roles={roles}
                        />
                    }
                >

                    <Route
                        path="/privada"
                        element={
                            <h1>
                                Contenido privado
                            </h1>
                        }
                    />

                </Route>

            </Routes>

        </MemoryRouter>
    );
}

describe(
    "ProtectedRoute",
    () => {

        beforeEach(() => {

            vi.clearAllMocks();
        });

        it(
            "redirige al login cuando no existe usuario autenticado",
            () => {

                mockedUseAuth.mockReturnValue({
                    usuario: null,
                    cargandoSesion: false,
                    autenticado: false,
                    iniciarSesion: vi.fn(),
                    cerrarSesion: vi.fn(),
                    tieneRol: vi.fn()
                });

                renderProtegida();

                expect(
                    screen.getByRole(
                        "heading",
                        {
                            name: /login/i
                        }
                    )
                ).toBeInTheDocument();
            }
        );

        it(
            "redirige a sin permiso cuando el rol no está autorizado",
            () => {

                mockedUseAuth.mockReturnValue({
                    usuario: {
                        id: 10,
                        nombre: "Socio Prueba",
                        email: "socio@fitclub.com",
                        rol: "SOCIO",
                        socioId: 4,
                        instructorId: null
                    },
                    cargandoSesion: false,
                    autenticado: true,
                    iniciarSesion: vi.fn(),
                    cerrarSesion: vi.fn(),
                    tieneRol: vi.fn()
                });

                renderProtegida([
                    "ADMINISTRADOR",
                    "RECEPCION"
                ]);

                expect(
                    screen.getByRole(
                        "heading",
                        {
                            name: /sin permiso/i
                        }
                    )
                ).toBeInTheDocument();
            }
        );

        it(
            "permite acceder cuando el rol está autorizado",
            () => {

                mockedUseAuth.mockReturnValue({
                    usuario: {
                        id: 1,
                        nombre: "Administrador",
                        email: "admin@fitclub.com",
                        rol: "ADMINISTRADOR",
                        socioId: null,
                        instructorId: null
                    },
                    cargandoSesion: false,
                    autenticado: true,
                    iniciarSesion: vi.fn(),
                    cerrarSesion: vi.fn(),
                    tieneRol: vi.fn()
                });

                renderProtegida([
                    "ADMINISTRADOR"
                ]);

                expect(
                    screen.getByRole(
                        "heading",
                        {
                            name: /contenido privado/i
                        }
                    )
                ).toBeInTheDocument();
            }
        );
    }
);