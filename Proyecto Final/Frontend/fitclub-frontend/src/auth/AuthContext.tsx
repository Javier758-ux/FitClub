import {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState
} from "react";

import type {
    ReactNode
} from "react";

import {
    authService
} from "../services/authService";

import type {
    LoginRequest,
    RolUsuario,
    UsuarioActual
} from "../services/authService";

import {
    AUTH_UNAUTHORIZED_EVENT
} from "./authStorage";

interface AuthContextValue {

    usuario:
        UsuarioActual | null;

    cargandoSesion:
        boolean;

    autenticado:
        boolean;

    iniciarSesion: (
        datos: LoginRequest
    ) => Promise<void>;

    cerrarSesion:
        () => void;

    tieneRol: (
        ...roles: RolUsuario[]
    ) => boolean;
}

const AuthContext =
    createContext<
        AuthContextValue | null
    >(null);

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({
                                 children
                             }: AuthProviderProps) {

    const [
        usuario,
        setUsuario
    ] =
        useState<
            UsuarioActual | null
        >(null);

    const [
        cargandoSesion,
        setCargandoSesion
    ] =
        useState(true);

    /*
     * Al iniciar React:
     *
     * token
     *   ↓
     * GET /auth/me
     *   ↓
     * usuario global
     */
    useEffect(() => {

        let activo = true;

        function manejarNoAutorizado() {

            setUsuario(null);

            setCargandoSesion(
                false
            );
        }

        window.addEventListener(
            AUTH_UNAUTHORIZED_EVENT,
            manejarNoAutorizado
        );

        async function restaurarSesion() {

            if (
                !authService.haySesion()
            ) {

                if (activo) {
                    setCargandoSesion(
                        false
                    );
                }

                return;
            }

            try {

                const actual =
                    await authService
                        .obtenerUsuarioActual();

                if (activo) {

                    setUsuario(
                        actual
                    );
                }

            } catch {

                /*
                 * Si fue 401,
                 * apiClient ya eliminó
                 * el token.
                 */
                if (
                    activo &&
                    !authService.haySesion()
                ) {

                    setUsuario(
                        null
                    );
                }

            } finally {

                if (activo) {

                    setCargandoSesion(
                        false
                    );
                }
            }
        }

        void restaurarSesion();

        return () => {

            activo = false;

            window.removeEventListener(
                AUTH_UNAUTHORIZED_EVENT,
                manejarNoAutorizado
            );
        };

    }, []);

    async function iniciarSesion(
        datos: LoginRequest
    ): Promise<void> {

        setCargandoSesion(
            true
        );

        try {

            await authService
                .iniciarSesion(
                    datos
                );

            /*
             * Después del login obtenemos
             * el contexto completo:
             *
             * rol
             * socioId
             * instructorId
             */
            const actual =
                await authService
                    .obtenerUsuarioActual();

            setUsuario(
                actual
            );

        } catch (error) {

            authService
                .cerrarSesion();

            setUsuario(
                null
            );

            throw error;

        } finally {

            setCargandoSesion(
                false
            );
        }
    }

    function cerrarSesion(): void {

        authService
            .cerrarSesion();

        setUsuario(
            null
        );

        setCargandoSesion(
            false
        );
    }

    const valor =
        useMemo<
            AuthContextValue
        >(
            () => ({

                usuario,

                cargandoSesion,

                autenticado:
                    usuario !== null,

                iniciarSesion,

                cerrarSesion,

                tieneRol: (
                    ...roles:
                    RolUsuario[]
                ) =>
                    usuario !== null &&
                    roles.includes(
                        usuario.rol
                    )

            }),
            [
                usuario,
                cargandoSesion
            ]
        );

    return (

        <AuthContext.Provider
            value={valor}
        >

            {children}

        </AuthContext.Provider>
    );
}

export function useAuth():
    AuthContextValue {

    const contexto =
        useContext(
            AuthContext
        );

    if (!contexto) {

        throw new Error(
            "useAuth debe utilizarse dentro de AuthProvider"
        );
    }

    return contexto;
}