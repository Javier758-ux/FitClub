export const AUTH_TOKEN_KEY = "fitclub_token";

export const AUTH_UNAUTHORIZED_EVENT =
    "fitclub:unauthorized";

export function obtenerToken(): string | null {
    return sessionStorage.getItem(
        AUTH_TOKEN_KEY
    );
}

export function guardarToken(
    token: string
): void {
    sessionStorage.setItem(
        AUTH_TOKEN_KEY,
        token
    );
}

export function eliminarToken(): void {
    sessionStorage.removeItem(
        AUTH_TOKEN_KEY
    );
}

export function notificarSesionNoAutorizada(): void {
    eliminarToken();

    window.dispatchEvent(
        new Event(
            AUTH_UNAUTHORIZED_EVENT
        )
    );
}